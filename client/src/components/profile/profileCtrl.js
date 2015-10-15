(function() {
  'use strict';

  angular.module('app.profile', [])
  .controller('ProfileCtrl', ['$state', 'ajaxFactory', '$cookies', 'profileFactory', 'heroFactory', 'requesterFactory', 'Upload', function($state, ajaxFactory, $cookies, profileFactory, heroFactory, requesterFactory, Upload) {
    var vm = this;
    vm.user = profileFactory.getProfile();
    vm.isEdit = false;
    vm.hideProfilePic = false;

    if (vm.user.profilePhoto === 'placeholder/image' || vm.user.profilePhoto === undefined) {
      vm.user.myProfilePhoto = 'http://lorempixel.com/250/250/';
    } else {
      vm.user.myProfilePhoto = vm.user.profilePhoto;
    }

    function calculateAverageRating() {
      var total = 0;
      var count = 0;
      var ratings = profileFactory.getProfile('ratings');
      for (var key in ratings) {
        total += Number(ratings[key]);
        count += 1;
      }
      var averageRating = total/count;
      
      if (averageRating === null || averageRating === undefined) {
        averageRating = 'n/a';
      } else {
        averageRating = averageRating.toString().slice(0, 3);
      }
      profileFactory.setProfile({'averageRating': averageRating});
      vm.rating = averageRating;
    }
    calculateAverageRating();

    var getTransactionHistory = function(username) {
      ajaxFactory.getTransactionHistory(username)
        .then(function(response) {
          vm.userTransactions = response.data;
          for (var i = 0; i < vm.userTransactions.length; i++) {
            vm.userTransactions[i].meetingTime = moment(vm.userTransactions[i].meetingTime).format("MMM DD YYYY, hh:mmA");   
          }
        }, function(response) {
          console.log(response.status);
        });
    };

    getTransactionHistory(vm.user.username);

    vm.toggleEdit = function() {
      vm.isEdit = !vm.isEdit;
    };

    vm.update = function() {
      ajaxFactory.postUpdatedProfile(vm.user)
        //will be executed if status code is 200-299
        .then(function(response) {
          profileFactory.setProfile(vm.user);
          vm.isEdit = false;
        //will be exectcuted if status code is 300+

        }, function(response) {
          var statusCode = response.status;
          console.log('Profile update: server errorCallback', statusCode);
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
          for (var i = myfile.length - 1; i >= 0; i--) {
            if (myfile[i] === '.') {
              period = i;
              break;
            }
          }
          var extension = myfile.slice(period);
          profileFactory.setProfile({ profilePhoto: './profile-pic/' + vm.user.username + extension });
        }, function(response) {
          vm.errorMsg = response.status;
        });
      }
    };

  }]);

})();

