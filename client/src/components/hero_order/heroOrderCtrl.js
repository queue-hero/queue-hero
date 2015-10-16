(function() {
  'use strict';

  angular.module('app.hero_order', [])
  .controller('HeroOrderCtrl', ['heroOrderModel', '$scope', '$interval', 'heroFactory', '$state', 'socketFactory', function(heroOrderModel, $scope, $interval, heroFactory, $state, socketFactory) {
    var vm = this;
    vm.complete = false;
    vm.rating = '5';

    vm.order = heroFactory.getOrder();

    socketFactory.on('checkOrderComplete', function(bool) {
      if (bool === true) {
        //if order is complete, switch ui-views
        $interval.cancel(checkOrder);
        vm.complete = true;
      }
    });

    var checkOrder = $interval(isOrderComplete, 1000, 0, false);

    $scope.$on('$destroy', function() {
      $interval.cancel(checkOrder);
    });


    function isOrderComplete() {
      socketFactory.emit('isOrderComplete', vm.order.transactionId);
    }

    vm.rateRequester = function() {
      var rating = parseInt(vm.rating, 10);
      heroOrderModel.rateRequester(rating, vm.order.requester, vm.order.transactionId)
        .then(function(response) {
          //clear the factory containing transaction details
          heroFactory.setOrder({
            requester: undefined,
            additionalRequests: undefined,
            item: undefined,
            meetingTime: undefined,
            meetingLocation: undefined,
            meetingLocationLatLong: undefined,
            moneyExchanged: undefined,
            status: undefined,
            transactionId: undefined,
            vendor: undefined,
            vendorYelpId: undefined
          });

          //circle back to choice
          $state.go('choice');

        }, function(response) {
          console.log(response.status);
        });
    };

  }]);

})();
