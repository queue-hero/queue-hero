(function() {
  'use strict';

  angular.module('app.profile', [])
  .controller('ProfileCtrl', ['$state', 'ajaxFactory', '$cookies', 'profileFactory', 'heroFactory', 'requesterFactory', 'Upload', function($state, ajaxFactory, $cookies, profileFactory, heroFactory, requesterFactory, Upload) {
    var vm = this;
    vm.user = profileFactory.getProfile();
    vm.isEdit = false;
    vm.hideProfilePic = false;

    if(vm.user.profilePhoto === 'placeholder/image' || vm.user.profilePhoto === undefined){
      vm.user.myProfilePhoto = 'http://lorempixel.com/100/200/';
    }else{
      vm.user.myProfilePhoto = vm.user.profilePhoto;
    }

    vm.toggleEdit = function() {
      vm.isEdit = !vm.isEdit;
    };

    vm.update = function() {
      ajaxFactory.postUpdatedProfile(vm.user)
        //will be executed if status code is 200-299
        .then(function(response) {
          profileFactory.setProfile(vm.user);
          $state.go('choice');
        //will be exectcuted if status code is 300+
        }, function(response) {
          var statusCode = response.status;

        });
    };

    vm.uploadFiles = function(file) {
      vm.f = file;

      if (file && !file.$error) {
        vm.hideProfilePic = true;

        var myfile = vm.f.name.slice();
        file.upload = Upload.upload({
          url: '/profile/pic/' + vm.user.username,
          file: file,
          method: 'POST'
        });

        file.upload.then(function(response) {
          var period;
          for(var i = myfile.length - 1; i >= 0; i--){
            if(myfile[i] === '.'){
              period = i;
              break;
            }
          }
          var extension = myfile.slice(period);
          profileFactory.setProfile({profilePhoto: './profile-pic/' + vm.user.username + extension});
        }, function(response) {
          vm.errorMsg = response.status;
        });
      }
    };

  }]);

})();

