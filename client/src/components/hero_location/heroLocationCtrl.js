(function() {
  'use strict';

  angular.module('app.hero_location', [])
    .controller('HeroLocationCtrl', ['$state', 'heroFactory', function($state, heroFactory) {
      var vm = this;
      vm.selection = undefined;

      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(success, error, options);

      //**toDo - dummy data should remove later
      vm.locations = [{
        restaurant: 'starbucks',
        address: '123 main street'
      }, {
        restaurant: 'subway',
        address: '456 mission street'
      }, {
        restaurant: 'chipotle',
        address: '789 market street'
      }];



      vm.select = function(index) {
        vm.selection = index;
      };

      vm.confirm = function() {
        //set location of hero to vm.locations[vm.selection]
        heroFactory.setOrder(vm.locations[vm.selection]);
        $state.go('hero_task');
      };


      function success(position) {
        vm.lat = position.coords.latitude;
        vm.long = position.coords.longitude;
      }

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      }




    }]);

})();
