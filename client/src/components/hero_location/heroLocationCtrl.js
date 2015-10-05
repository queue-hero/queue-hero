(function() {
  'use strict';

  angular.module('app.hero_location', [])
  .controller('HeroLocationCtrl', ['$state', 'ajaxFactory', 'heroFactory', 'profileFactory', function($state, ajaxFactory, heroFactory, profileFactory) {

    var vm = this;
    vm.selection = undefined;

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

    vm.select = function(index) {

      vm.selection = index;
    };
    vm.confirm = function() {
      var queueHero = profileFactory.getProfile('username');
      //set location of hero to vm.locations[vm.selection]
      ajaxFactory.setHeroLocation(queueHero, vm.locations[vm.selection])
        //will be executed if status code is 200-299,
        .then(function successCallback(response) {
          var venue = vm.locations[vm.selection];
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

    function success(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      ajaxFactory.getVenuesAtHeroLocation(lat, long)
      //will be executed if status code is 200-299
        .then(function successCallback(response) {
          vm.locations = response.data;
      });
    }

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }

  }]);

})();
