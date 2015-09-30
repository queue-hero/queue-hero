(function() {
  'use strict';

  angular.module('app')
  .factory('ajaxFactory', ['$http', function($http) {
    var serverUrl = 'http://127.0.0.1:3000';
    var ajaxObj = {};

    ajaxObj.getProfileData = function(username) {
      return $http({
        method: 'GET',
        url: serverUrl + '/choice',
        //params can be retrieved from server using req.query.username
        params: {username: username}
      });
    };

    ajaxObj.singUp = function (user) {
      var req = {
       method: 'POST',
       url: serverUrl,
       data: { 'user': user }
      };
      $http(req).then(
        function successCallback(response) {
          console.log('signUp:', 'success from the server');
        },
        function errorCallback(response) {
          console.log('signUp:','ERROR from the server');
        });
    };

    return ajaxObj;

  }]);

})();
