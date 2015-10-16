(function() {
  'use strict';

  angular.module('app.hero_location', [])
  .controller('HeroLocationCtrl', ['$state', 'heroLocationModel', 'heroFactory', 'profileFactory', '$interval', '$scope', 'socketFactory', function($state, heroLocationModel, heroFactory, profileFactory, $interval, $scope, socketFactory) {

    var vm = this;
    vm.selection = undefined;
    vm.taskView = false;
    var taskCache;
    vm.orders = {};
    var requestCounts;

    // currentLocation: [lat, long]
    var location = heroFactory.getOrder('currentLocation');
    var lat = location[0];
    var long = location[1];

    heroLocationModel.getVenuesAtHeroLocation(lat, long)
      //will be executed if status code is 200-299
      .then(function(response) {
        vm.locations = response.data;
        taskCache = vm.locations.slice();
        populatePins();
        getAllRequests(vm.locations);

        socketFactory.on('newRequestCount', function(data) {
          //listen for changes in queueHero counts
          var yelpId = data[0];
          var heroCount = data[1];

          var vendor = _.findWhere(vm.locations, { yelpId: data[0] });
          if (vendor !== undefined) {
            vendor.requests = data[1];
          }

        });

        var requestCount = $interval(getRequestCount, 1000, 0, false);

        $scope.$on('$destroy', function() {
            $interval.cancel(requestCount);
        });
      });


    function getAllRequests(locations) {
      locations.forEach(function(location) {
        heroLocationModel.getOpenRequests(location.yelpId)
          .then(function(response) {
            vm.orders[location.yelpId] = response.data;

          }, function(response) {
            console.log(response.status);
          });
      });

    }

    function getRequestCount() {
      for (var i = 0; i < vm.locations.length; i++) {
       socketFactory.emit('getRequestCount', vm.locations[i].yelpId);
      }
    }

    vm.confirm = function(index) {
      var queueHero = profileFactory.getProfile('username');
      var venue = vm.locations[index];

      //set location of hero to selected venue
      heroLocationModel.setHeroLocation(queueHero, venue)
        //will be executed if status code is 200-299,
        .then(function(response) {
          heroFactory.setOrder({
            queueHero: queueHero,
            vendor: venue.name,
            vendorYelpId: venue.yelpId,
            meetingLocation: venue.displayAddress,
            meetingLocationLatLong: [venue.lat, venue.long],
            status: 'checked in'
          });
          vm.locations = vm.locations.splice(index, 1);
          populatePins();
          vm.taskView = true;
      });
    };

    vm.callback = function(map) {
      vm.map = map;
      map.setView([lat, long], 16);
    };

    vm.showList = function() {
      vm.locations = taskCache.slice();
      vm.taskView = false;
      populatePins();
    };

    var pinIcon = L.icon({
      iconUrl: '/images/pin.png',
      iconRetinaUrl: '/images/pin.png',
      iconSize: [30,41]
    });

    var populatePins = function(locations) {

      vm.map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          vm.map.removeLayer(layer);
        }
      });

      var locationsGeojson = [];
      if (vm.locations.length === 1) {
        var locationChosen = vm.locations[0];
        locationsGeojson.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [locationChosen.long, locationChosen.lat]
          },
          "properties": {
            "title": '<p><strong>' + locationChosen.name + '</p></strong>',
            "description": locationChosen.displayAddress,
            "marker-color": "#DC3C05",
            "marker-size": "large",
            "marker-symbol": "star"
          }
        });
      } else {
        for (var i = 0; i < vm.locations.length; i++) {
          var location = vm.locations[i];
          locationsGeojson.push({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [location.long, location.lat]
            },
            "properties": {
              "title": '<p><strong>' + location.name + '</p></strong>',
              "description": location.displayAddress,
              "marker-color": "#3ca0d3",
              "marker-size": "large",
              "marker-symbol": i + 1
            }
          });
        }
      }
      L.mapbox.featureLayer(locationsGeojson).addTo(vm.map);
    };

  }]);

})();
