(function() {
  'use strict';

  angular.module('app.choice', ['ngCookies'])
  .controller('ChoiceCtrl', ['ajaxFactory', 'profileFactory', '$state', '$cookies', function(ajaxFactory, profileFactory, $state, $cookies) {
    var vm = this;

    if (profileFactory.getProfile('facebookId') === undefined) {
      profileFactory.setProfile({ facebookId: $cookies.get('com.queuehero') });
    }

    //**toDo - fix hardcoded "username" to take username from token
    var username = 'darrin';

    //when controller loads, fire GET request for user info
    ajaxFactory.getProfileData(username)
      .then(function successCallback(response) {
        //will be executed if status code is 200-299
        var data = response.data;
        console.log(data);

        //save profile information into factory for future use
        profileFactory.setProfile(data);

      }, function errorCallback(response) {
        //will be exectcuted if status code is 300+
        var statusCode = response.status;

      });

      vm.hero = function() {
        $state.go('hero_location');
      };

      vm.requester = function() {
        $state.go('requester_task');
      };

  }]);

})();
