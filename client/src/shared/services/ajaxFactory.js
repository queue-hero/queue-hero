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





    return ajaxObj;

  }]);

})();
