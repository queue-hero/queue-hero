(function() {
  'use strict';

  angular.module('app')
    .factory('heroFactory', ['$window', function($window) {
      var order = {
        transactionId: undefined,
        queueHero: undefined,
        requester: undefined,
        item: undefined,
        moneyExchanged: undefined,
        vendor: undefined,
        vendorYelpId: undefined,
        meetingLocation: undefined,
        meetingLocationLatLong: undefined,
        currentLocation: undefined,
        meetingTime: undefined,
        status: undefined,
        additionalRequests: undefined
      };

      return {
        getOrder: getOrder,
        setOrder: setOrder,
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
        if(obj === undefined) {
          order = {};
          return true;
        }
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
