(function() {
  'use strict';

  angular.module('app.requester_task', [])
    .controller('RequesterTaskCtrl', ['profileFactory', 'requesterFactory', 'ajaxFactory', '$state', function(profileFactory, requesterFactory, ajaxFactory, $state) {
      var vm = this;
      vm.currentView = 'location';

      vm.order = requesterFactory.getOrder();

      var currentLocation = requesterFactory.getOrder('currentLocation');

      ajaxFactory.getVenuesAtRequesterLocation(currentLocation[0], currentLocation[1])
        .then(function(response) {
          vm.venues = response.data;
          populatePins();
        }, function(err) {
          console.log(err.status);
        });

      vm.callback = function(map) {
        vm.map = map;
        map.setView([currentLocation[0], currentLocation[1]], 20);
      };

      var pinIcon = L.icon({
        iconUrl: '/images/pin.png',
        iconRetinaUrl: '/images/pin.png',
        iconSize: [30,41]
      });

      var populatePins = function() {
        for (var i = 0; i < vm.venues.length; i++) {
        var venue = vm.venues[i];
        var venueName = venue.vendor;
        var popupContent = '<p><strong>' + venueName + '</strong></p>';
        L.marker([venue.meetingLocation[0], venue.meetingLocation[1]], {
          icon: pinIcon
        }).bindPopup(popupContent, { offset: L.point(0, -20) }).openPopup().addTo(vm.map);
      }
      };

      vm.selectLocation = function(shop) {
        vm.vendor = shop.vendor;
        vm.vendorYelpId = shop.vendorYelpId;
        vm.meetingLocation = [shop.meetingLocation[0], shop.meetingLocation[1]];
        requesterFactory.setOrder({
          vendor: vm.vendor,
          meetingLocation: vm.meetingLocation,
          vendorYelpId: vm.vendorYelpId
        });
        console.log('set requester factory to have vendor and meetingloc' + vm.vendor + vm.meetingvenue);
        vm.currentView = 'item';
      };

      vm.setItem = function() {
        requesterFactory.setOrder({
          item: vm.item,
          additionalRequests: vm.details
        });
        vm.currentView = 'time_price';
      };

      vm.pickTimePrice = function() {
        vm.time = Date.now() + vm.time*60000;
        requesterFactory.setOrder({
          meetingTime: vm.time,
          moneyExchanged: vm.price,
          status: 'unfulfilled'
        });
        vm.order = requesterFactory.getOrder();
        vm.currentView = 'confirm';
      };

      vm.confirmOrder = function() {
        ajaxFactory.sendOrder(vm.order)
          .then(function successCallback(response) {
            //save transaction id from server to factory
            requesterFactory.setOrder({
              transactionId: response.data,
              status: 'complete'
            });

            //move to next state
            $state.go('requester_order');

          }, function errorCallback(response) {
          });
      };


    }
  ]);

})();
