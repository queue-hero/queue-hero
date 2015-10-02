(function() {
  'use strict';

  angular.module('app.requester_task', [])
  .controller('RequesterTaskCtrl', [function() {
    var vm = this;
    
    vm.location = true;
    vm.item = false;
    vm.timePrice = false;
    vm.confirm = false;


  }]);

})();
