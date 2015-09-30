(function() {
  'use strict';

  angular.module('app')
  .factory('heroFactory', [function() {
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
