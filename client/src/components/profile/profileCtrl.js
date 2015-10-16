(function() {
  'use strict';

  angular.module('app.profile', [])
  .controller('ProfileCtrl', ['$state', 'profileModel', '$cookies', 'profileFactory', 'heroFactory', 'requesterFactory', 'Upload', function($state, profileModel, $cookies, profileFactory, heroFactory, requesterFactory, Upload) {
    var vm = this;
    vm.user = profileFactory.getProfile();
    vm.isEdit = false;
    vm.hideProfilePic = false;

    if (vm.user.profilePhoto === 'placeholder/image' || vm.user.profilePhoto === undefined) {
      vm.user.myProfilePhoto = 'http://lorempixel.com/250/250/';
    } else {
      vm.user.myProfilePhoto = vm.user.profilePhoto;
    }
    vm.removeClosed = function(transaction) {
      var now = Date.now();
      return (transaction.meetingTimeValid < now && transaction.status === 'unfulfilled') ? false : true;
    };

    function calculateAverageRating() {
      var total = 0;
      var count = 0;
      var ratings = profileFactory.getProfile('ratings');
      for (var key in ratings) {
        if (ratings[key] !== undefined) {
          total += Number(ratings[key]);
          count += 1;
        }
      }
      if (count === 0) {
        vm.rating = 'n/a';
      } else {
        vm.rating = total / count;
        profileFactory.setProfile({ 'averageRating': vm.rating });
      }

    }
    calculateAverageRating();

    var getTransactionHistory = function(username) {
      profileModel.getTransactionHistory(username)
        .then(function(response) {
          for (var i = 0; i < response.data.length; i++) {
            response.data[i].meetingTimeValid = Date.parse(response.data[i].meetingTime);
            response.data[i].meetingTime = moment(response.data[i].meetingTime).format("MMM DD YYYY, hh:mmA");
          }
          vm.userTransactions = response.data;
        }, function(response) {
          console.log(response.status);
        });
    };

    getTransactionHistory(vm.user.username);

    vm.toggleEdit = function() {
      vm.isEdit = !vm.isEdit;
    };

    vm.update = function() {
      profileModel.postUpdatedProfile(vm.user)
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

