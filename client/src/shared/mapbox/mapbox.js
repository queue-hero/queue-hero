angular.module('app').directive('mapbox', [
   function () {
       return {
           restrict: 'EA',
           replace: true,
           scope: {
               callback: "="
           },
           template: '<div></div>',
           link: function (scope, element, attributes) {
               L.mapbox.accessToken = 'pk.eyJ1Ijoic2hyZWV5YWdvZWwiLCJhIjoiY2lmN2NzcmtrMGU5a3M2bHpubXlyaDlkNiJ9.U7xOePZsA83ysE6ZE9P1oQ';
               var map = L.mapbox.map(element[0], 'shreeyagoel.cif7csqcv0eews4lznq9rpu2b');
               scope.callback(map);
           }
       };
   }
]);
