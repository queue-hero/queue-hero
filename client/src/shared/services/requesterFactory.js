(function() {
  'use strict';

  angular.module('app')
    .factory('requesterFactory', [function() {
      var order = {
        transactionId: undefined,
        queueHero: undefined,
        requester: undefined,
        item: undefined,
        additionalRequests: undefined,
        moneyExchanged: undefined,
        vendor: undefined,
        meetingLocation: undefined,
        meetingTime: undefined,
        status: undefined
      };

      return {
        getOrder: getOrder,
        setOrder: setOrder
      };

      function getOrder(keys) {
        if (keys === undefined) {
          return order;
        }

        if (angular.isArray(keys)) {
          var results = {};
          for (var i = 0; i < keys.length; i++) {
            if (keys[i] in order) {
              results[keys[i]] = order[keys[i]];
            } else {
              results[keys[i]] = null;
            }
          }
          return results;
        }

        if (angular.isString(keys)) {
          if (keys in order) {
            return order[keys];
          }
        }

        return null;
      }


      function setOrder(obj) {
        if (!angular.isObject(obj)) {
          return null;
        }
        var allValidKeys = true;
        for (var key in obj) {
          if (key in order) {
            order[key] = obj[key];
          } else {
            allValidKeys = false;
          }
        }
        return allValidKeys;
      }

    }]);

})();
