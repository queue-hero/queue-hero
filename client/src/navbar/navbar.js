(function(){
  'use strict';

  angular.module("app")
  .directive("navBar", ['$window', '$state', function($window, $state) {
    return {
      restrict: 'E',
      templateUrl: 'src/navbar/navbar.html',
      link: function(scope, elem, attrs) {
      }
    };
  }]);

})();


