(function() {
  'use strict';

  angular.module('app.choice', [])
  .controller('ChoiceCtrl', ['ajaxFactory', 'profileFactory', function(ajaxFactory, profileFactory){
    var vm = this;

    //**toDo - fix hardcoded "username" to take username from token
    var username = 'darrin';

    //when controller loads, fire GET request for user info
    ajaxFactory.getProfileData(username)
      .then(function successCallback(response){
        //will be executed if status code is 200-299
        var data = response.data;

        //save profile information into factory for future use
        profileFactory.setProfile(data);

      }, function errorCallback(response){
        //will be exectcuted if status code is 300+
        var statusCode = response.status;

      });


  }]);

})();
