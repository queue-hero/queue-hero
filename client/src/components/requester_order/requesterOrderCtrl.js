(function() {
  'use strict';

  angular.module('app.requester_order', [])
  .controller('RequesterOrderCtrl', [function() {
    var vm = this;
    vm.complete = false;

    //FIX: These values have to be procured from the factory
    vm.location = '2nd and Mission';
    vm.orderItem = 'Starbucks mocha frappe';
    vm.additionalRequests = 'With whipped cream!';
    vm.meetingTime = Date.now() + 30*60000;
    vm.price = 6;
    vm.remainingTime = 20;
    vm.transactionId = 1;

    vm.queueHero = '';

    /*Continuously polls server asking whether requester's
    //order has been accepted yet.*/
    function isOrderAccepted() {

    };

    /*Sends notice to server that exchange occurred*/
    function orderFulfilled() {

    };


  }]);

})();
