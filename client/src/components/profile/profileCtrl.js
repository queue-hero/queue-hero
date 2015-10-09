(function() {
  'use strict';

  angular.module('app.profile', [])
  .controller('ProfileCtrl', ['$state', 'ajaxFactory', '$cookies', 'profileFactory', 'heroFactory', 'requesterFactory', function($state, ajaxFactory, $cookies, profileFactory, heroFactory, requesterFactory) {
    var vm = this;
    vm.user = profileFactory.getProfile();
    vm.isEdit = false;

    vm.toggleEdit = function() {
      vm.isEdit = !vm.isEdit;
    };

    vm.update = function() {
      ajaxFactory.postUpdatedProfile(vm.user)
        //will be executed if status code is 200-299
        .then(function successCallback(response) {
          profileFactory.setProfile(vm.user);
          $state.go('choice');
        //will be exectcuted if status code is 300+
        }, function errorCallback(response) {
          var statusCode = response.status;
          console.log('Profile update: server errorCallback', statusCode);
        });
    };

  }]);

})();

