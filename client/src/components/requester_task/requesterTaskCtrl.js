(function() {
  'use strict';

  angular.module('app.requester_task', [])
  .controller('RequesterTaskCtrl', ['profileFactory', function(profileFactory) {

    var vm = this;
    //assumes that the object has a location property
    vm.userProfile = profileFactory.getProfile();

    vm.getMap = function (location){
      return userProfile.location;
    };

    vm.getMap(userProfile.location);

  }]);

})();
