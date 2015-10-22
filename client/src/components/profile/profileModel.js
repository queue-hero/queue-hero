;(function() {
  'use strict';

  angular.module('app.profile')
  .factory('profileModel', ['$http', 'herokuUrl', 'serverUrl', function($http, herokuUrl, serverUrl) {
    var model = {};

    model.getTransactionHistory = function(username) {
      return $http({
        method: 'GET',
        url: serverUrl + '/transactions',
        params: { username: username }
      });
    };

    model.postUpdatedProfile = function(user) {
      return $http({
        method: 'POST',
        url: serverUrl + '/profile/update',
        data: { user: user }
      });
    };

    return model;

  }]);


})();
