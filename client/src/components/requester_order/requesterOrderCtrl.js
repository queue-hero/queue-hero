(function() {
  'use strict';

  angular.module('app.requester_order', [])
  .controller('RequesterOrderCtrl', ['$interval', 'ajaxFactory', 'requesterFactory', '$state', function($interval, ajaxFactory, requesterFactory, $state) {
    var vm = this;
    vm.complete = false;

    //FIX: These values have to be procured from the factory
    vm.location = '2nd and Mission';
    vm.orderItem = 'Starbucks mocha frappe';
    vm.additionalRequests = 'With whipped cream!';
    vm.meetingTime = Date.now() + 30*60000;
    vm.price = 6;
    vm.remainingTime = 20;
    vm.transactionId = 1;

    vm.queueHero = '';

    var checkOrder = $interval(isOrderAccepted, 5000, 0, false);

    /*Continuously polls server asking whether requester's
    /order has been accepted yet.*/
    function isOrderAccepted() {
      ajaxFactory.isOrderAccepted(vm.transactionId)
        .then(function(response) {
          if (response.data === true) {

            //order is accepted, switch ui-views
            vm.complete = true;

            //cancel polling
            $interval.cancel(checkOrder);

          }
        }, function(response) {

        });
    };

    /*Sends notice to server that exchange occurred*/
    vm.confirmReceipt = function() {
      console.log('confirming receipt');
      ajaxFactory.orderFulfilled(vm.transactionId)
        .then(function(response) {

          //clear factory
          requesterFactory.setOrder({});

          //progress to choice
          $state.go('choice');

        }, function(response) {
          console.log(response.status);
        })
    };


  }]);

})();
