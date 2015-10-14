(function() {
  'use strict';

  angular.module('app.requester_task', [])
    .controller('RequesterTaskCtrl', ['profileFactory', 'requesterFactory', 'ajaxFactory', '$state', "$scope", "$interval", function(profileFactory, requesterFactory, ajaxFactory, $state, $scope, $interval) {
      var vm = this;
      vm.itemView = false;
      var venueCache;
      vm.result1 = '';
      vm.options1 = null;
      vm.details1 = '';

      vm.order = requesterFactory.getOrder();

      var currentLocation = requesterFactory.getOrder('currentLocation').slice();
      var heroCounts;

      vm.getMyLocation = function() {
        currentLocation = requesterFactory.getOrder('currentLocation').slice();
        getVenues(currentLocation[0], currentLocation[1]);
      };

      vm.searchLocation = function() {
        currentLocation[0] = vm.details1.geometry.location.lat();
        currentLocation[1] = vm.details1.geometry.location.lng();
        getVenues(currentLocation[0], currentLocation[1]);
      };

      function getVenues(lat, long){
      ajaxFactory.getVenuesAtRequesterLocation(lat, long)
        .then(function(response) {
          vm.venues = response.data;
          venueCache = vm.venues.slice();
          populatePins();
        }, function(err) {
        }).then(function(){
          heroCounts = $interval(getHeroCounts, 1000, 0, false);
          $scope.$on("$destroy", function() {
              $interval.cancel(heroCounts);
          });
        });
      }

      getVenues(currentLocation[0], currentLocation[1]);

      var getHeroCounts = function() {
        var yelpIds = [];
        for (var i = 0; i < vm.venues.length; i++) {
          yelpIds.push(vm.venues[i].yelpId);

          ajaxFactory.getOpenHeroCount(vm.venues[i].yelpId)
            .then(function(response) {
              var data = response.data;
              if (vm.venues[yelpIds.indexOf(data[0])] !== undefined) {
                vm.venues[yelpIds.indexOf(data[0])].heroes = data[1];
              }
            }, function(response) {
              console.log(response.status);
            });
        }
      };

      vm.callback = function(map) {
        vm.map = map;
        map.setView([currentLocation[0], currentLocation[1]], 16);
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

        var venuesGeojson = [];
        if (vm.venues.length === 1) {
          var venueChosen = vm.venues[0];
          venuesGeojson.push({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [venueChosen.long, venueChosen.lat]
            },
            "properties": {
              "title": '<p><strong>' + venueChosen.name + '</p></strong>',
              "description": venueChosen.displayAddress,
              "marker-color": "#DC3C05",
              "marker-size": "large",
              "marker-symbol": "star"
            }
          });
        } else {
          for (var i = 0; i < vm.venues.length; i++) {
            var venue = vm.venues[i];
            venuesGeojson.push({
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [venue.long, venue.lat]
              },
              "properties": {
                "title": '<p><strong>' + venue.name + '</p></strong>',
                "description": venue.displayAddress,
                "marker-color": "#3ca0d3",
                "marker-size": "large",
                "marker-symbol": i + 1
              }
            });
          }
        }
        L.mapbox.featureLayer(venuesGeojson).addTo(vm.map);

      };

      vm.selectLocation = function(venue, index) {
        vm.vendor = venue.name;
        vm.vendorYelpId = venue.yelpId;
        vm.meetingLocation = [venue.lat, venue.long];
        vm.meetingAddress = venue.displayAddress;
        requesterFactory.setOrder({
          vendor: vm.vendor,
          meetingLocation: vm.meetingLocation,
          meetingAddress: vm.meetingAddress,
          vendorYelpId: vm.vendorYelpId
        });
        vm.venues = vm.venues.splice(index, 1);
        vm.itemView = true;
        populatePins();
      };

      vm.confirmOrder = function() {
        requesterFactory.setOrder({
          item: vm.item,
          additionalRequests: vm.details,
          meetingTime: Date.now() + vm.time * 60000,
          moneyExchanged: vm.price,
          status: 'unfulfilled'
        });
        vm.order = requesterFactory.getOrder();
        ajaxFactory.sendOrder(vm.order)
          .then(function(response) {
            //save transaction id from server to factory
            requesterFactory.setOrder({
              transactionId: response.data
            });

            //move to next state
            $state.go('requester_order');

          }, function(response) {
          });
      };

      vm.showList = function() {
        vm.venues = venueCache.slice();
        vm.itemView = false;
        populatePins();
      };


    }
  ]);

})();
