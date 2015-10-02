(function() {
  'use strict';

  angular.module('app.requester_task', [])
  .controller('RequesterTaskCtrl', [function() {
    var vm = this;

    vm.location = true;
    vm.item = false;
    vm.timePrice = false;
    vm.confirm = false;

    vm.confirmOrder = function() {
      //TODO: get all order details from factory
      
      //make ajaxFactoryRequest
      //FIX: Hardcoded order for now
      ajaxFactoryRequest.sendOrder({ item: 'Starbucks Frappucino', 
                                     price: 6, 
                                     time: Date.now() })
        .then(function (response) {

          console.log('order was submitted successfully');

          //move to next state
          $state.go('requester_order');
        }, function (response) {
          console.log(response.status);
        })
    };


  }]);

})();
