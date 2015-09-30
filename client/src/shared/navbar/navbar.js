(function() {
  'use strict';

  angular.module('app')
  .directive('navBar', ['$window', '$state', function($window, $state) {
    return {
      restrict: 'E',
      templateUrl: 'src/shared/navbar/navbar.html',
      link: function(scope, elem, attrs) {
      }
    };
  }]);

})();


