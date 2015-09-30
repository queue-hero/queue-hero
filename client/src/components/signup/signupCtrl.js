(function() {
  'use strict';

  angular.module('app.signup', [])
  .controller('SignupCtrl', ['ajaxFactory', function(ajaxFactory) {
    var vm = this;
    vm.user = {};

    vm.update = function() {
      ajaxFactory.signUp(user);
    };

  }]);

})();

