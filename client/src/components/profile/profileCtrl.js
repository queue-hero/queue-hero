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
      console.log('update', 'ran', vm.user);
      ajaxFactory.postUpdatedProfile(vm.user)
        //will be executed if status code is 200-299
        .then(function successCallback(response) {
          profileFactory.setProfile(vm.user);
          $state.go('choice');
        //will be exectcuted if status code is 300+
        }, function errorCallback(response) {
          console.log('errorCallback', 'error');
          var statusCode = response.status;

        });
    };

    vm.uploadFiles = function(file) {
      vm.f = file;

      if (file && !file.$error) {
        vm.hideProfilePic = true;

        file.upload = Upload.upload({
          url: '/profile/pic/' + vm.user.username,
          file: file,
          method: 'POST'
        });

        file.upload.then(function(response) {
          //should send back src url for img
        }, function(response) {
          vm.errorMsg = response.status;
        });
      }
    };

  }]);

})();

