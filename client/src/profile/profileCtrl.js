(function() {
  'use strict';

  angular.module('app.profile', [])
  .controller('ProfileCtrl', ['$state', function($state){
    var vm = this;

    vm.username = $state.params.username;

  }]);

})();
