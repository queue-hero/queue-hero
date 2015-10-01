(function() {
  'use strict';

  angular.module('app.hero_order', [])
  .controller('HeroOrderCtrl', ['ajaxFactory', '$scope', '$interval', 'heroFactory', function(ajaxFactory, $scope, $interval, heroFactory) {
    var vm = this;
    vm.complete = false;

    //**place holders, this information should come from server
    //once server routes our enabled, this will provide order data
    //**this information should actually be in the hero factory, 
    //not gotten from the server (order data)
    vm.order = heroFactory.getOrder();

    vm.time = 20;
    vm.order.item = 'starbucks mocha frappe';
    vm.requester = 'Darrin';
    vm.transactionId = 1;


    var checkOrder = $interval(isOrderComplete, 2000, 0, false);


    function isOrderComplete(){
      ajaxFactory.isOrderComplete(vm.transactionId)
        .then(function(response){
          if(response.data === true){
            //if order is complete, switch ui-views
            vm.complete = true;

            //tell angular to run the digest cycle
            $scope.apply();

            //stop in recurring ajax request from occuring
            $interval.cancel(checkOrder);

            //remove current transaction from factory
            heroFactory.setOrder({});

          }
        }, function(response){
          console.log(response.status);
        });
    }

  }]);

})();
