(function() {
  'use strict';

  angular.module('app.requester_task', [])
    .controller('RequesterTaskCtrl', ['profileFactory', 'requesterFactory', 'ajaxFactory', '$state', function(profileFactory, requesterFactory, ajaxFactory, $state) {
      var vm = this;
      vm.currentView = 'location';

      vm.order = requesterFactory.getOrder();

      //**toDo make this take requesters currentView location
      var defaultArea = 'san francisco';


      vm.loadActiveShops = function() {

        ajaxFactory.getActiveShops(defaultArea)
          .then(function successCallback(response) {
            vm.activeShops = response.data;
            vm.buildMap(defaultArea, vm.activeShops);

          }, function errorCallback(response) {
            var statusCode = response.status;
          });
      };

      vm.loadActiveShops();

      vm.buildMap = function(location, activeShops) {
        //the mapping library function should be call here:
      };

      vm.select = function(shop) {
        vm.order.vendor = shop;
        //FIXME: hardcoded
        vm.order.meetingLocation = [1, 1];
      };

      vm.pickLocation = function(shop) {
        requesterFactory.setOrder({
          vendor: vm.order.vendor,
          meetingLocation: vm.order.meetingLocation
        });
        vm.currentView = 'item';
      };

      vm.setItem = function() {
        requesterFactory.setOrder({
          item: vm.item,
          additionalRequests: vm.details
        });
        vm.currentView = 'time_price';
      };

      vm.pickTimePrice = function() {
        vm.time = Date.now() + vm.time*60000;
        requesterFactory.setOrder({
          meetingTime: vm.time,
          moneyExchanged: vm.price,
          status: 'unfulfilled'
        });
        vm.order = requesterFactory.getOrder();
        vm.currentView = 'confirm';
      };

      vm.confirmOrder = function() {

        ajaxFactory.sendOrder(vm.order)
          .then(function(response) {

            //save transaction id from server to factory
            requesterFactory.setOrder({
              transactionId: response.data
            });

            //move to next state
            $state.go('requester_order');

          }, function(response) {
            console.log(response.status);
            requesterFactory.setOrder({
              status: 'complete'
            });
          });
      };


    }
  ]);

})();
