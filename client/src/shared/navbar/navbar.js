(function() {
  'use strict';

  angular.module('app')
  .directive('navBar', ['$window', '$state', '$cookies', function($window, $state, $cookies) {
    return {
      restrict: 'E',
      templateUrl: 'src/shared/navbar/navbar.html',
      link: function(scope, elem, attrs) {
        scope.logout = function() {
          $cookies.remove('connect.sid');
          $state.go('home');
        };
        scope.isLogged = function(){
          if ($state.is('home')||$state.is('signup')){
            return false;
          } else {
            return true;
          }
        };
        scope.isHome = function(){
          return $state.is('home');
        };
      }
    };
  }]);

})();


