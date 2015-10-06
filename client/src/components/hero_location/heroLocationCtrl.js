(function() {
  'use strict';

  angular.module('app.hero_location', [])
  .controller('HeroLocationCtrl', ['$state', 'ajaxFactory', 'heroFactory', 'profileFactory', function($state, ajaxFactory, heroFactory, profileFactory) {

    var vm = this;
    vm.selection = undefined;

    // currentLocation: [lat, long]
    var location = heroFactory.getOrder('currentLocation');
    var lat = location[0];
    var long = location[1];

    ajaxFactory.getVenuesAtHeroLocation(lat, long)
      //will be executed if status code is 200-299
      .then(function successCallback(response) {
        vm.locations = response.data;
        populatePins();
    });

    vm.select = function(index) {
      vm.selection = index;
    };

    vm.confirm = function() {
      var queueHero = profileFactory.getProfile('username');
      var venue = vm.locations[vm.selection];

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
          $state.go('hero_task');
      });
    };

    vm.callback = function(map) {
      console.log('callback was called');
      vm.map = map;
      map.setView([lat, long], 15);
    }

    var populatePins = function(locations) {
      console.log('populate pins was called');
      for (var i = 0; i < vm.locations.length; i++) {
        var location = vm.locations[i];
        var locationName = location.name;
        var locationAddress = location.displayAddress;
        console.log(locationName, locationAddress);
        
      }
    }

  }]);

})();
