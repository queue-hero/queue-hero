(function() {
  'use strict';

  angular.module('app')
  .directive('navBar', ['$window', '$state', '$cookies', function($window, $state, $cookies) {
    return {
      restrict: 'E',
      templateUrl: 'src/shared/navbar/navbar.html',
      link: function(scope, elem, attrs) {
        scope.logout = function() {
          $cookies.remove('com.queuehero');
          $state.go('home');
        };
      }
    };
  }]);

})();


