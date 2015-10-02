(function() {
  'use strict';

  angular.module('app.requester_task', [])
  .controller('RequesterTaskCtrl', ['profileFactory', 'requesterFactory', 'ajaxFactory.js', '$state', function(profileFactory, requesterFactory, ajaxFactory, $state) {

    var current = 'location';
    var vm = this;
    vm.mission = {};
    //assumes that the object has a location property
    vm.userProfile = profileFactory.getProfile();
    var defaultArea = userProfile.location;



    vm.loadActiveShops = function(){

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
      requesterFactory.setOrderProperty('shop',shop);
      current = 'item';
    };

    vm.setItem = function(item) {
      requesterFactory.setOrderProperty('item',item);
      current = 'price';
    };


    vm.loadActiveShops();

    vm.pickTimePrice = function() {
      vm.current = '';
    };

    vm.confirmOrder = function() {
      //TODO: get all order details from factory

      //make ajaxFactoryRequest
      //FIX: Hardcoded order for now
      ajaxFactory.sendOrder({ item: 'Starbucks Frappucino',
                              price: 6,
                              time: Date.now() })
        .then(function(response) {

          console.log('order was submitted successfully');

          //move to next state
          $state.go('requester_order');
        }, function (response) {
          console.log(response.status);
        });
    };

  }]);

})();
