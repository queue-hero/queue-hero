(function() {
  'use strict';

  angular.module('app.hero_location', [])
  .controller('HeroLocationCtrl', ['$state', 'ajaxFactory', 'heroFactory', 'profileFactory', function($state, ajaxFactory, heroFactory, profileFactory) {

    var vm = this;
    vm.selection = undefined;
    var mboxToken = 'pk.eyJ1Ijoic2hyZWV5YWdvZWwiLCJhIjoiY2lmN2NzcmtrMGU5a3M2bHpubXlyaDlkNiJ9.U7xOePZsA83ysE6ZE9P1oQ';

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

    function success(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      ajaxFactory.getVenuesAtHeroLocation(lat, long)
      //will be executed if status code is 200-299
        .then(function successCallback(response) {
          vm.locations = response.data;

          L.mapbox.accessToken = mboxToken;
          var map = L.mapbox.map('map', 'shreeyagoel.cif7csqcv0eews4lznq9rpu2b')
          .setView([37.7874963,-122.3999087], 20);
      });
    }

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }

  }]);

})();
