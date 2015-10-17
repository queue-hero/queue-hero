;(function() {
  'use strict';

  angular.module('app.hero_task', [])
    .controller('HeroTaskCtrl', ['heroTaskModel', '$state', 'heroFactory', '$interval', '$scope', 'socketFactory', function(heroTaskModel, $state, heroFactory, $interval, $scope, socketFactory) {
      var vm = this;
      vm.confirmView = false;
      vm.noOrdersView = false;
      vm.vendorYelpId = heroFactory.getOrder('vendorYelpId');
      var OrderCache;
      var orderSelected;
      //test to see if there is lag when open requests are initially shown
      // if it is laggy, we can use the below line as a starting point
      // vm.orders = $scope.$parent.main.orders[vm.vendorYelpId].slice();
      vm.vendor = heroFactory.getOrder('vendor');

      socketFactory.on('newOpenRequests', function(requests) {
        if (!vm.confirmView) {
          vm.orders = requests;
          OrderCache = vm.orders.slice();
        } else {
          OrderCache = requests;
        }
        if (vm.orders.length === 0) {
          vm.noOrdersView = true;
        } else {
          vm.noOrdersView = false;
        }
      });
      var refreshTasks = $interval(getOpenRequests, 1000, 0, false);

      $scope.$on('$destroy', function() {
          $interval.cancel(refreshTasks);
      });

      function getOpenRequests() {
        socketFactory.emit('getOpenRequests', vm.vendorYelpId);
      }

      getOpenRequests();

      vm.removeFromQueue = function() {
        //stop refreshing the page for new requests
        // $interval.cancel(refreshTasks);
        heroTaskModel.removeFromQueue(heroFactory.getOrder('username'))
          .then(function(response) {
            heroFactory.setOrder({
              meetingLocation: undefined,
              meetingLocationLatLong: undefined,
              status: undefined,
              vendor: undefined,
              vendorYelpId: undefined
            });
            $scope.$parent.main.showList();
          }, function(response) {
            console.log(response.status);
          });
      };

      vm.select = function(index) {
        vm.orders = vm.orders.splice(index, 1);
        vm.confirmView = true;
        orderSelected = index;
      };

      vm.cancel = function(){
        vm.orders = OrderCache.slice();
        vm.confirmView = false;
      };

      vm.accept = function() {
        heroTaskModel.confirmRequest(vm.orders[orderSelected]._id, heroFactory.getOrder('queueHero'))
          .then(function(response) {
            //stop refreshing the page for new requests
            $interval.cancel(refreshTasks);
            //save current transaction to heroFactory
            heroFactory.setOrder(vm.orders[orderSelected]);
            heroFactory.setOrder({ transactionId: vm.orders[orderSelected]._id });
            $state.go('hero_order');
          }, function(response) {
            console.log(response.status);

          });
      };

    }]);

})();
