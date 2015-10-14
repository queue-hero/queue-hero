(function() {
  'use strict';

  angular.module('app')
    .directive('ngAutocomplete', ['$parse', function($parse) {
      return {

        scope: {
          details: '=',
          ngAutocomplete: '=',
          options: '='
        },

        link: function(scope, element, attrs, model) {

          //options for autocomplete
          var myOptions;

          //convert options provided to myOptions
          var initOptions = function() {
            myOptions = {};
            if (scope.options) {
              if (scope.options.types) {
                myOptions.types = [];
                myOptions.types.push(scope.options.types);
              }
              if (scope.options.bounds) {
                myOptions.bounds = scope.options.bounds;
              }
              if (scope.options.country) {
                myOptions.componentRestrictions = {
                  country: scope.options.country
                };
              }
            }
          };
          initOptions();

          //create new autocomplete
          //reinitializes on every change of the options provided
          var newAutocomplete = function() {
            scope.gPlace = new google.maps.places.Autocomplete(element[0], myOptions);
            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
              scope.$apply(function() {
                scope.details = scope.gPlace.getPlace();
                scope.ngAutocomplete = element.val();
              });
            });
          };
          newAutocomplete();

          //watch options provided to directive
          scope.watchOptions = function() {
            return scope.options;
          };

          scope.$watch(scope.watchOptions, function() {
            initOptions();
            newAutocomplete();
            element[0].value = '';
            scope.ngAutocomplete = element.val();
          }, true);
        }
      };
    }]);
})();
