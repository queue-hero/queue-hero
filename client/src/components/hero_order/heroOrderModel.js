(function() {
  'use strict';

  angular.module('app.hero_order')
  .factory('heroOrderModel', ['$http', 'herokuUrl', 'serverUrl', function($http, herokuUrl, serverUrl) {
    var model = {};

    model.rateRequester = function(rating, requester, transactionId) {
      return $http({
        method: 'POST',
        url: serverUrl + '/hero/order/rate',
        data: {
          rating: rating,
          requester: requester,
          transactionId: transactionId
        }
      });
    };

    return model;

  }]);


})();
