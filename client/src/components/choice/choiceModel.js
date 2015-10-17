;(function() {
  'use strict';

  angular.module('app.choice')
  .factory('choiceModel', ['$http', 'herokuUrl', 'serverUrl', function($http, herokuUrl, serverUrl) {
    var model = {};

    model.getProfileData = function(facebookId) {
      return $http({
        method: 'GET',
        url: serverUrl + '/choice',
        params: { facebookId: facebookId }
      });
    };

    return model;

  }]);


})();
