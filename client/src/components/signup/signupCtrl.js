(function() {
  'use strict';

  angular.module('app.signup', [])
  .controller('SignupCtrl', ['ajaxFactory', '$cookies', 'profileFactory', function(ajaxFactory, $cookies, profileFactory) {
    var vm = this;
    vm.user = {};

    if (profileFactory.getProfile('facebookId') === undefined) {
      profileFactory.setProfile({ facebookId: $cookies.get('com.queuehero') });
    }




    vm.update = function() {
      ajaxFactory.postSignUp(vm.user)
        //will be executed if status code is 200-299
        .then(function successCallback(response) {
          state.go('choice');
        //will be exectcuted if status code is 300+
        }, function errorCallback(response) {
          var statusCode = response.status;

        });
    };

  }]);

})();

