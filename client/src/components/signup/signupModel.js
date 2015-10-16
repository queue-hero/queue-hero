(function() {
  'use strict';

  angular.module('app.signup')
  .factory('signupModel', ['$http', 'herokuUrl', 'serverUrl', function($http, herokuUrl, serverUrl) {
    var model = {};

    model.postSignUp = function(user) {
      return $http({
        method: 'POST',
        url: serverUrl + '/signup',
        data: { user: user }
      });
    };

    return model;

  }]);


})();
