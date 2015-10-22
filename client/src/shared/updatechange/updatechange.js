;(function() {
  'use strict';

  angular.module('app')
    .directive('updateChange', ['$timeout', function($timeout) {
      return {
        scope: {
          content: '@',
          type: '@'
        },
        template: '<span ng-class="updated" class="badge pull-right {{ updated }}">{{ content }} &nbsp; {{ category }}</span>',
        link: function(scope, element, attrs) {
          var plural = '';
          scope.updated = '';
          scope.category = '';
          var count = 0;

          if (scope.type === 'hero') {
            plural = 'es';
          } else if (scope.type === 'request') {
            plural = 's';
          }

          createCategory(scope.content);

          scope.$watch('content', function() {
            if (count === 1) {
              scope.updated = 'updated';
              createCategory(scope.content);
              $timeout(function() {
                scope.updated = '';
              }, 500, true);
            } else {
              count++;
            }
          });

          function createCategory(count) {
            if (count === '1') {
              scope.category = scope.type;
            } else {
              scope.category = scope.type + plural;
            }
          }
        }
      };

    }]);

})();

