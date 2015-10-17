;(function() {
  'use strict';

  angular.module('app.hero_task')
  .factory('heroTaskModel', ['$http', 'herokuUrl', 'serverUrl', function($http, herokuUrl, serverUrl) {
    var model = {};

    model.confirmRequest = function(transactionId, queueHero) {
      return $http({
        method: 'POST',
        url: serverUrl + '/hero/task',
        data: {
          transactionId: transactionId,
          queueHero: queueHero
        }
      });
    };

    model.removeFromQueue = function(username) {
      return $http({
        method: 'POST',
        url: serverUrl + '/hero/task/removal',
        data: { username: username }
      });
    };

    model.getRequesterRating = function(requester) {
      return $http({
        method: 'GET',
        url: serverUrl + '/hero/task/rating',
        params: { username: requester }
      });
    };

    return model;

  }]);


})();
