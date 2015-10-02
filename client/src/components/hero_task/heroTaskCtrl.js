(function() {
  'use strict';

  angular.module('app.hero_task', [])
    .controller('HeroTaskCtrl', ['ajaxFactory', '$state', 'heroFactory', function(ajaxFactory, $state, heroFactory) {
      var vm = this;
      vm.displayId = 0;
      vm.confirm = false;

      // this will be a get request from server
      vm.orders = [{
        time: "2015-10-02T05:20:58.409Z",
        item: 'starbucks mocha frappe',
        requester: 'Darrin',
        transactionId: 10923,
        price: 6,
      }, {
        time: "2015-10-02T05:27:58.409Z",
        item: 'Americano',
        requester: 'Tatsumi',
        transactionId: 12,
        price: 3,
      }, {
        time: "2015-10-02T05:23:21.892Z",
        item: 'cookie',
        requester: 'Shreeya',
        transactionId: 1223,
        price: 2,

      }];

      ajaxFactory.getOpenRequests(vm.location)
        .then(function(response) {
          // vm.orders = response.data;

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
        ajaxFactory.confirmRequest(vm.orders[id].transactionId)
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
