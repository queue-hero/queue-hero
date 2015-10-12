(function() {
  'use strict';

  angular.module('app.requester_order', [])
  .controller('RequesterOrderCtrl', ['$interval', 'ajaxFactory', 'requesterFactory', '$state', function($interval, ajaxFactory, requesterFactory, $state) {
    var vm = this;
    vm.order = requesterFactory.getOrder();
    vm.complete = 'details';

    var checkOrder = $interval(isOrderAccepted, 5000, 0, false);

    vm.cancelOrder = function() {
      ajaxFactory.cancelOrder(vm.order.transactionId)
        .then(function(response) {
          requesterFactory.setOrder({
            additionalRequests: undefined,
            item: undefined,
            meetingTime: undefined,
            meetingLocation: undefined,
            moneyExchanged: undefined,
            status: undefined,
            transactionId: undefined,
            vendor: undefined,
            vendorYelpId: undefined
          });
          //cancel interval:
          $interval.cancel(checkOrder);
          //the user may want to put a new order after cancelling
          $state.go('requester_task');
          }, function(response) {
            console.log(response.status);
          });

    };

    /*Sends notice to server that exchange occurred*/
    vm.confirmReceipt = function() {
      ajaxFactory.orderFulfilled(vm.order.transactionId)
        .then(function(response) {

          //order is confirmed, switch ui-view to rate hero
          vm.complete = 'rate';

        }, function(response) {
          console.log(response.status);
        });
    };

    vm.rateHero = function() {
      ajaxFactory.rateHero(vm.rating, vm.order.queueHero, vm.order.transactionId)
        .then(function(response) {

          requesterFactory.setOrder();

          //circle back to choice
          $state.go('choice');

        }, function(response) {
          console.log(response.status);
        });

    };

    /*Continuously polls server asking whether requester's
    /order has been accepted yet.*/
    function isOrderAccepted() {
      ajaxFactory.isOrderAccepted(vm.order.transactionId)
        .then(function(response) {
          if (response.data) {

            vm.order.queueHero = response.data;
            requesterFactory.setOrder({ queueHero: response.data });

            //order is accepted, switch ui-views
            vm.complete = 'complete';

            //cancel polling
            $interval.cancel(checkOrder);

            //call getDirections
            getDirections();

          }
        }, function(response) {
            console.log(response.status);
        });
    }

    /*Gets directions for requester once order has been accepted*/
    function getDirections() {
      var currentLocation = requesterFactory.getOrder('currentLocation');
      var meetingLocation = requesterFactory.getOrder('meetingLocation');
      ajaxFactory.getDirections(currentLocation, meetingLocation)
        .then(function(response) {
          //plot this geojson on a map on the page
          console.log(response.data);
        }, function(error) {
          console.log(error.status);
        });
    }


  }]);

})();
