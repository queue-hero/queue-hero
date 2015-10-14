(function() {
  'use strict';

  angular.module('app')
    .directive('navBar', ['$window', '$state', '$cookies', function($window, $state, $cookies) {
      return {
        restrict: 'E',
        templateUrl: 'src/shared/navbar/navbar.html',
        link: function(scope, elem, attrs) {

          scope.isLoggedIn = function() {
            return ($state.is('home') || $state.is('signup')) ? false : true;
          };

          scope.isCurrentState = function(state) {
            return $state.is(state);
          };

          scope.logout = function() {
            $cookies.remove('connect.sid');
            removeSessionStorage();
            $state.go('home');

          };

          scope.goToState = function(state) {
            $state.go(state);
          };

          scope.inTransaction = function() {
            return $state.is('requester_order') || $state.is('requester_order');
          };

          var removeSessionStorage = function() {
            var items = Object.keys(sessionStorage);
            items.forEach(function(item) {
              sessionStorage.removeItem(item);
            });

          };

        }
      };
    }]);

})();


