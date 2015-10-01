(function() {
  'use strict';

  angular.module('app.requester_task', [])
  .controller('RequesterTaskCtrl', ['profileFactory', 'requesterFactory', 'ajaxFactory.js', $state, function(profileFactory, ajaxFactory, $state) {

    var current = 'location';
    var vm = this;
    //assumes that the object has a location property
    vm.userProfile = profileFactory.getProfile();
    var defaultArea = userProfile.location;


    vm.loadActiveShops = function (){

      getActiveShops(defaultArea)
        .then(function successCallback(response){
          vm.activeShops = response.activeShops;
          vm.buildMap(defaultArea, vm.activeShops);

        }, function errorCallback(response) {
            var statusCode = response.status;
        });
    };

    vm.buildMap = function (location, activeShops){
    //the mapping library function should be call here:
    };

    vm.createMission = function (shop){
      requesterFactory.setOrderProperty('shop',shop);
      current = 'item';
    };

    vm.loadActiveShops();

  }]);

})();
