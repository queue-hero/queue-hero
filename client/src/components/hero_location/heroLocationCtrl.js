(function() {
  'use strict';

  angular.module('app.hero_location', [])
  .controller('HeroLocationCtrl', ['$state', 'ajaxFactory', 'heroFactory', 'profileFactory', '$interval', function($state, ajaxFactory, heroFactory, profileFactory, $interval) {

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

    ajaxFactory.getVenuesAtHeroLocation(lat, long)
      //will be executed if status code is 200-299
      .then(function(response) {
        vm.locations = response.data;
        taskCache = vm.locations.slice();
        populatePins();
      }).then(function() {
        getAllRequests(vm.locations);
        requestCounts = $interval(getRequestCounts, 1000, 0, false);
      });


    function getAllRequests(locations) {
      locations.forEach(function(location) {
        ajaxFactory.getOpenRequests(location.yelpId)
          .then(function(response) {
            vm.orders[location.yelpId] = response.data;

          }, function(response) {
            console.log(response.status);
          });
      });

    }

    var getRequestCounts = function() {
      var yelpIds = [];
      for (var i = 0; i < vm.locations.length; i++) {
        yelpIds.push(vm.locations[i].yelpId);

        ajaxFactory.getOpenRequestCount(vm.locations[i].yelpId)
          .then(function(response) {
            var data = response.data;
            if (vm.locations[yelpIds.indexOf(data[0])] !== undefined) {
              vm.locations[yelpIds.indexOf(data[0])].requests = data[1];
            }
          }, function(response) {
            console.log(response.status);
          });
      }

    };

    vm.confirm = function(index) {
      var queueHero = profileFactory.getProfile('username');
      var venue = vm.locations[index];

      //set location of hero to selected venue
      ajaxFactory.setHeroLocation(queueHero, venue)
        //will be executed if status code is 200-299,
        .then(function successCallback(response) {
          heroFactory.setOrder({
            queueHero: queueHero,
            vendor: venue.name,
            vendorYelpId: venue.yelpId,
            meetingLocation: venue.displayAddress,
            meetingLocationLatLong: [venue.lat, venue.long],
            status: 'checked in'
          });
          vm.locations = vm.locations.splice(index, 1);
          vm.taskView = true;
      });
    };

    vm.callback = function(map) {
      vm.map = map;
      map.setView([lat, long], 20);
    };

    vm.showList = function() {
      vm.locations = taskCache.slice();
      vm.taskView = false;
    };

    var pinIcon = L.icon({
      iconUrl: '/images/pin.png',
      iconRetinaUrl: '/images/pin.png',
      iconSize: [30,41]
    });

    var populatePins = function(locations) {
      for (var i = 0; i < vm.locations.length; i++) {
        var location = vm.locations[i];
        var locationName = location.name;
        var locationAddress = location.displayAddress;
        var popupContent = '<p><strong>' + locationName + '</strong></p>' +
          '<p>' + locationAddress + '</p>';
        L.marker([location.lat, location.long], {
          icon: pinIcon
        }).bindPopup(popupContent, { offset: L.point(0, -20) }).openPopup().addTo(vm.map);
      }
    };

  }]);

})();
