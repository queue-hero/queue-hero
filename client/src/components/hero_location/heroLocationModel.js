;(function() {
  'use strict';

  angular.module('app.hero_location')
  .factory('heroLocationModel', ['$http', 'herokuUrl', 'serverUrl', function($http, herokuUrl, serverUrl) {
    var model = {};

    model.getOpenRequests = function(vendorYelpId) {
      return $http({
        method: 'GET',
        url: serverUrl + '/hero/task',
        params: { vendorYelpId: vendorYelpId }
      });
    };

    model.getVenuesAtHeroLocation = function(lat, long) {
      return $http({
        method: 'GET',
        url: serverUrl + '/hero/location',
        params: {
          lat: lat,
          long: long
        }
      });
    };

    model.setHeroLocation = function(queueHero, location) {
      return $http({
        method: 'POST',
        url: serverUrl + '/hero/location',
        data: {
          queueHero: queueHero,
          location: location
        }
      });
    };

    return model;

  }]);


})();
