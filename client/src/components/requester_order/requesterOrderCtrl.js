(function() {
  'use strict';

  angular.module('app.requester_order', [])
  .controller('RequesterOrderCtrl', ['$interval', 'ajaxFactory', 'requesterFactory', '$state', function($interval, ajaxFactory, requesterFactory, $state) {
    var vm = this;
    vm.complete = 'details';

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
          if (response.data.accepted === true) {

            //order is accepted, switch ui-views
            vm.complete = 'complete';

            //cancel polling
            $interval.cancel(checkOrder);

          }
        }, function(response) {
            console.log(response.status);
        })
    };

    /*Sends notice to server that exchange occurred*/
    vm.confirmReceipt = function() {
      console.log('confirming receipt');
      ajaxFactory.orderFulfilled(vm.transactionId)
        .then(function(response) {

          //order is confirmed, switch ui-view to rate hero
          vm.complete = 'rate';

        }, function(response) {
          console.log(response.status);
        })
    };

    vm.rateHero = function() {
      console.log('rating hero');
      var rating = vm.rating;
      var hero = requesterFactory.getOrder('queueHero');
      ajaxFactory.rateHero(rating, hero)
        .then(function(response) {

          //clear factory
          requesterFactory.setOrder({});

          //circle back to choice
          $state.go('choice');

        }, function(response) {
          console.log(response.status);
        })

      
    }


  }]);

})();
