(function() {
  'use strict';

  angular.module('app.requester_order', [])
  .controller('RequesterOrderCtrl', ['$interval', 'ajaxFactory', 'requesterFactory', '$state', '$scope', function($interval, ajaxFactory, requesterFactory, $state, $scope) {
    var vm = this;
    vm.order = requesterFactory.getOrder();
    vm.complete = 'details';
    var currentLocation = requesterFactory.getOrder('currentLocation');
    var meetingLocation = requesterFactory.getOrder('meetingLocation');

    var checkOrder = $interval(isOrderAccepted, 5000, 0, false);

    $scope.$on("$destroy", function() {
        $interval.cancel(checkOrder);
    });

    vm.cancelOrder = function() {
      ajaxFactory.cancelOrder(vm.order.transactionId)
        .then(function(response) {
          requesterFactory.setOrder({
            additionalRequests: undefined,
            item: undefined,
            meetingTime: undefined,
            meetingLocation: undefined,
            meetingLocationLatLong: undefined,
            moneyExchanged: undefined,
            status: undefined,
            transactionId: undefined,
            vendor: undefined,
            vendorYelpId: undefined
          });
          //cancel interval:
          // $interval.cancel(checkOrder);
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

          requesterFactory.setOrder({
            queueHero: undefined,
            additionalRequests: undefined,
            item: undefined,
            meetingTime: undefined,
            meetingLocation: undefined,
            meetingLocationLatLong: undefined,
            moneyExchanged: undefined,
            status: undefined,
            transactionId: undefined,
            vendor: undefined,
            vendorYelpId: undefined
          });

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
          if (response.data !== false) {

            vm.order.queueHero = response.data;
            requesterFactory.setOrder({ queueHero: response.data });

            //order is accepted, switch ui-views
            vm.complete = 'complete';

            //call getDirections
            getDirections();
          } else if (Date.now() > vm.order.meetingTime) {
            ajaxFactory.cancelOrder(vm.order.transactionId)
              .then(function(response) {
                requesterFactory.setOrder({
                  additionalRequests: undefined,
                  item: undefined,
                  meetingTime: undefined,
                  meetingLocation: undefined,
                  meetingLocationLatLong: undefined,
                  moneyExchanged: undefined,
                  status: undefined,
                  transactionId: undefined,
                  vendor: undefined,
                  vendorYelpId: undefined
                });

                $state.go('requester_task');
              });
          }
        }, function(response) {
            console.log(response.status);
        });
    }

    var pinIcon = L.icon({
      iconUrl: '/images/pin.png',
      iconRetinaUrl: '/images/pin.png',
      iconSize: [30,41]
    });

    /*Gets directions for requester once order has been accepted*/
    function getDirections() {
      ajaxFactory.getDirections(currentLocation, meetingLocation)
        .then(function(response) {

          //add marker for source
          L.marker([currentLocation[0], currentLocation[1]], {icon: pinIcon}).addTo(vm.map);
          //add marker for destination
          L.marker([meetingLocation[0], meetingLocation[1]], {icon: pinIcon}).addTo(vm.map);

          //plot the route on the map
          var directionsObject = response.data;
          L.geoJson(directionsObject.routes[0].geometry, {}).addTo(vm.map);

        }, function(error) {
          console.log(error.status);
        });
    }

    vm.callback = function(map) {
      vm.map = map;
      map.setView([currentLocation[0], currentLocation[1]], 20);
    };


  }]);

})();
