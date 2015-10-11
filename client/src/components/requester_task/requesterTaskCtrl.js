(function() {
  'use strict';

  angular.module('app.requester_task', [])
    .controller('RequesterTaskCtrl', ['profileFactory', 'requesterFactory', 'ajaxFactory', '$state', function(profileFactory, requesterFactory, ajaxFactory, $state) {
      var vm = this;
      vm.itemView = false;
      var venueCache;

      vm.order = requesterFactory.getOrder();

      var currentLocation = requesterFactory.getOrder('currentLocation');

      ajaxFactory.getVenuesAtRequesterLocation(currentLocation[0], currentLocation[1])
        .then(function(response) {
          vm.venues = response.data;
          venueCache = vm.venues.slice();
          populatePins();
        }, function(err) {
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
        vm.map.eachLayer(function(layer) {
          if (layer instanceof L.Marker) {
            vm.map.removeLayer(layer);
          }
        });

        for (var i = 0; i < vm.venues.length; i++) {
          var venue = vm.venues[i];
          var venueName = venue.name;
          var venueAddress = venue.displayAddress;
          var popupContent = '<p><strong>' + venueName + '</strong></p>';
          L.marker([venue.lat, venue.long], {
            icon: pinIcon
          }).bindPopup(popupContent, { offset: L.point(0, -20) }).openPopup().addTo(vm.map);
        }
      };

      vm.selectLocation = function(venue, index) {
        vm.vendor = venue.name;
        vm.vendorYelpId = venue.yelpId;
        vm.meetingLocation = [venue.lat, venue.long];
        requesterFactory.setOrder({
          vendor: vm.vendor,
          meetingLocation: vm.meetingLocation,
          vendorYelpId: vm.vendorYelpId
        });
        vm.venues = vm.venues.splice(index, 1);
        vm.itemView = 'item';
        populatePins();
      };

      vm.setItem = function() {
        requesterFactory.setOrder({
          item: vm.item,
          additionalRequests: vm.details
        });
      };

      vm.pickTimePrice = function() {
        vm.time = Date.now() + vm.time*60000;
        requesterFactory.setOrder({
          meetingTime: vm.time,
          moneyExchanged: vm.price,
          status: 'unfulfilled'
        });
        vm.order = requesterFactory.getOrder();
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

      vm.showList = function(){
        vm.venues = venueCache.slice();
        vm.itemView = false;
        populatePins();
      };


    }
  ]);

})();
