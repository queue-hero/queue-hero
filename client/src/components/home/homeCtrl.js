(function() {
  'use strict';

  angular.module('app.home', [])
  .controller('HomeCtrl', ['ajaxFactory', '$state', function(ajaxFactory, $state) {
    var vm = this;

    vm.signUp = function() {
      ajaxFactory.facebookAuth('signup')
        .then(function(response){
          var username = response.username;
          //save token
          $state.go('signup');

        }, function(response){
          var status = response.status;
          //alert user that facebook login failed
        });
    };

    vm.login = function() {
      ajaxFactory.facebookAuth('login')
        .then(function(response){
          var username = response.username;
          //save token
          $state.go('choice');

        }, function(response){
          var status = response.status;
          //alert user that facebook login failed
        });
    };

  }]);

})();

