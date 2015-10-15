(function() {
  'use strict';

  angular.module('app')
    .directive('updateChange', ['$timeout', function($timeout) {
      return {
        scope: {
          content: '@',
          type: '@'
        },
        template: '<span ng-class="updated" class="badge pull-right {{ updated }}">{{ message }}</span>',
        link: function(scope, element, attrs) {
          var plural = '';
          scope.updated = '';

          if (scope.type === 'hero') {
            plural = 'es';
          } else if (scope.type === 'request') {
            plural = 's';
          }

          createMessage(scope.content);

          scope.$watch('content', function() {
            scope.updated = 'updated';
            createMessage(scope.content);
            $timeout(function(){
              scope.updated = '';
            }, 500, true);
          });

          function createMessage(count){
            if (count === '1') {
              scope.message = scope.content + '    ' + scope.type;
            } else {
              scope.message = scope.content + '    ' + scope.type + plural;
            }
          }
        }
      };

    }]);

})();

