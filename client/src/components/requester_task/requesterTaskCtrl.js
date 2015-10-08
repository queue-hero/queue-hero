(function() {
  'use strict';

  angular.module('app.requester_task', [])
    .controller('RequesterTaskCtrl', ['profileFactory', 'requesterFactory', 'ajaxFactory', '$state', function(profileFactory, requesterFactory, ajaxFactory, $state) {
      var vm = this;
      vm.currentView = 'location';

      vm.order = requesterFactory.getOrder();

      //**toDo make this take requesters currentView location
      var defaultArea = requesterFactory.getOrder('currentLocation');

      vm.loadActiveShops = function() {
        console.log(defaultArea);
        ajaxFactory.getActiveShops(defaultArea)
          .then(function successCallback(response) {
            vm.activeShops = response.data;
            console.log(vm.activeShops);
            populatePins();

          }, function errorCallback(response) {
            var statusCode = response.status;
          });
      };

      vm.callback = function(map) {
        vm.map = map;
        map.setView([defaultArea[0], defaultArea[1]], 20);
      };

      vm.loadActiveShops();

      var heroIcon = L.icon({
        iconUrl: '/images/hero.png',
        iconRetinaUrl: '/images/hero.png',
        iconSize: [30,30]
      });

      var populatePins = function() {
        for (var i = 0; i < vm.activeShops.length; i++) {
        var activeShop = vm.activeShops[i];
        var activeShopName = activeShop.vendor;
        var popupContent = '<p><strong>' + activeShopName + '</strong></p>';
        L.marker([activeShop.meetingLocation[0], activeShop.meetingLocation[1]], {
          icon: heroIcon
        }).bindPopup(popupContent, { offset: L.point(0, -20) }).openPopup().addTo(vm.map);
      }
      };

      vm.selectLocation = function(shop) {
        //FIX: vendor and meetingLocation are hardcoded
        vm.order.vendor = shop;
        vm.order.meetingLocation = [1, 1];
        requesterFactory.setOrder({
          vendor: vm.order.vendor,
          meetingLocation: [1, 1]
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
          .then(function successCallback(response) {
            //save transaction id from server to factory
            requesterFactory.setOrder({
              transactionId: response.data,
              status: 'complete'
            });

            //move to next state
            $state.go('requester_order');

          }, function errorCallback(response) {
          });
      };


    }
  ]);

})();
