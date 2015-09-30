(function() {
  'use strict';

  angular.module('app')
  .factory('requesterFactory', [function() {
    var order = {};

    return {
      getOrder: getOrder,
      setOrder: setOrder
    };

    function getOrder() {
      return order;
    }

    function setOrder(updatedOrder) {
      order = updatedOrder;
    }

  }]);

})();
