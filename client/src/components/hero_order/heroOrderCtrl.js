(function() {
  'use strict';

  angular.module('app.hero_order', [])
  .controller('HeroOrderCtrl', ['ajaxFactory', '$scope', '$interval', 'heroFactory', '$state', function(ajaxFactory, $scope, $interval, heroFactory, $state) {
    var vm = this;
    vm.complete = false;

    vm.order = heroFactory.getOrder();

    var checkOrder = $interval(isOrderComplete, 5000, 0, false);


    function isOrderComplete() {
      ajaxFactory.isOrderComplete(vm.order.transactionId)
        .then(function(response) {
          console.log('Server said', response.data);
          if (response.data === true){
            //if order is complete, switch ui-views
            vm.complete = true;

            //stop in recurring ajax request from occuring
            $interval.cancel(checkOrder);

          }
        }, function(response) {
          console.log(response.status);
        });
    }

    vm.rateRequester = function() {
      var rating = parseInt(vm.rating, 10);
      ajaxFactory.rateRequester(rating, vm.order.requester, vm.order.transactionId)
        .then(function(response) {
          //clear the factory containing transaction details
          heroFactory.setOrder();

          //circle back to choice
          $state.go('choice');

        }, function(response) {
          console.log(response.status);
        });
    };

  }]);

})();
