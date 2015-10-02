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
          vm.activeShops = response.activeShops;
          vm.buildMap(defaultArea, vm.activeShops);

        }, function errorCallback(response) {
            var statusCode = response.status;
        });
    };

    vm.buildMap = function(location, activeShops) {
    //the mapping library function should be call here:
    };

    vm.createMission = function(shop) {
      vm.shop = shop;
      requesterFactory.setOrder({ shop: shop });
      vm.current = 'item';
    };

    vm.setItem = function() {
      requesterFactory.setOrder({ item: vm.item });
      vm.current = 'time_price';
    };

    vm.pickTimePrice = function() {
      requesterFactory.setOrder({ time: vm.time,
                                  price: vm.price });
      vm.current = 'confirm';
    };

    vm.confirmOrder = function() {
      //TODO: get all order details from factory

      //make ajaxFactoryRequest
      //FIX: Hardcoded order for now
      var order = requesterFactory.getOrder();

      ajaxFactory.sendOrder(order)
        .then(function(response) {
          console.log('order was submitted successfully');
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
