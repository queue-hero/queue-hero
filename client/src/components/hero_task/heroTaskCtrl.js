(function() {
  'use strict';

  angular.module('app.hero_task', [])
    .controller('HeroTaskCtrl', ['ajaxFactory', '$state', 'heroFactory', function(ajaxFactory, $state, heroFactory) {
      var vm = this;
      vm.displayId = 0;
      vm.confirm = false;

      ajaxFactory.getOpenRequests(vm.location)
        .then(function(response) {
          vm.orders = response.data;
          console.log(vm.orders);
        }, function(response) {
          console.log(response.status);
        });

      //show previous order in orders array
      vm.previous = function() {
        vm.displayId--;
        vm.confirm = false;
      };

      //show previous order in orders array
      vm.next = function() {
        vm.displayId++;
        vm.confirm = false;
      };

      //remove order from orders array, and decrement displayId unless there is only one order left
      vm.remove = function(id) {
        if(vm.displayId === vm.orders.length - 1 && vm.orders.length !== 1){
          vm.displayId--;
        }
        vm.orders.splice(id, 1);
      };

      vm.accept = function(id) {
        ajaxFactory.confirmRequest(vm.orders[id].transactionId, heroFactory.getOrder('queueHero'))
          .then(function(response) {
            //save current transaction to heroFactory
            heroFactory.setOrder(vm.orders[id]);
            $state.go('hero_order');
          }, function(response) {
            console.log(response.status);

          });
      };

    }]);

})();
