(function() {
  'use strict';

  angular.module('app')
  .factory('ajaxFactory', ['$http', function($http) {

    var factory = {};

    factory.singUp = function (user) {
      var req = {
       method: 'POST',
       url: 'http://',
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

    return factory;
  }]);

})();
