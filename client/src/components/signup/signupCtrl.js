(function() {
  'use strict';

  angular.module('app.signup', [])
  .controller('SignupCtrl', ['$state','ajaxFactory', function($state, ajaxFactory) {
    var vm = this;
    vm.user = {};

    vm.update = function() {
      ajaxFactory.postSignUp(vm.user)
        //will be executed if status code is 200-299
        .then(function successCallback(response) {
          $state.go('choice');
        //will be exectcuted if status code is 300+
        }, function errorCallback(response) {
          var statusCode = response.status;

        });
    };

  }]);

})();

