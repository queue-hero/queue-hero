(function() {
  'use strict';

  angular.module('app.requester_task', [])
  .controller('RequesterTaskCtrl', ['profileFactory', 'requesterFactory', 'ajaxFactory', '$state', function(profileFactory, requesterFactory, ajaxFactory, $state) {

    var vm = this;
    vm.current = 'location';
    // vm.mission = {};
    //assumes that the object has a location property
    vm.userProfile = profileFactory.getProfile();
    // change for userProfile.location
    var defaultArea = 'san francisco';


    vm.loadActiveShops = function() {

      ajaxFactory.getActiveShops(defaultArea)
        .then(function successCallback(response) {

          console.log(response);
          vm.activeShops = response.data;
          console.log(vm.activeShops);
          vm.buildMap(defaultArea, vm.activeShops);

        }, function errorCallback(response) {
            var statusCode = response.status;
        });
    };

    vm.buildMap = function(location, activeShops) {
    //the mapping library function should be call here:
    };

    vm.selectLocation = function(shop) {
      vm.shop = shop;
      //FIX: vendor and meetingLocation are hardcoded
      requesterFactory.setOrder({ vendor: 'Starbucks',
                                  meetingLocation: [1, 1]
                               });
      vm.current ='item';
    };

    vm.setItem = function() {
      requesterFactory.setOrder({ item: vm.item,
                                  additionalRequests: vm.details
                                });
      vm.current = 'time_price';
    };

    vm.pickTimePrice = function() {
      requesterFactory.setOrder({ meetingTime: vm.time,
                                  moneyExchanged: vm.price });
      vm.current = 'confirm';
      vm.order = requesterFactory.getOrder();
    };

    vm.confirmOrder = function() {

      //get order from factory
      vm.order = requesterFactory.getOrder();

      ajaxFactory.sendOrder(vm.order)
        .then(function(response) {
          console.log('order was submitted successfully:', vm.order);

          //save transaction id from server to factory
          requesterFactory.setOrder({ transactionId: response.data });

          //move to next state
          $state.go('requester_order');

        }, function(response) {
          console.log(response.status);
          requesterFactory.setOrder({ status: 'complete' });
        });
    };

    vm.loadActiveShops();

  }]);

})();
