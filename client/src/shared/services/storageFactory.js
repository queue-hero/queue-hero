(function() {
  'use strict';
angular
  .module('app')
  .factory('storageFactory',['$window', function($window){
    return {
      setSession: function( key, value ){
        try{
          if( $window.Storage ){
            $window.sessionStorage.setItem( key, value );
            return true;
          } else {
            return false;
          }
        } catch( error ){
          console.error( error, error.message );
        }
      },
      getSession: function( key ){
        try{
          if( $window.Storage ){
            return $window.sessionStorage.setItem( key );
          } else {
            return false;
          }
        } catch( error ){
          console.error( error, error.message );
        }
      }
    };
  }]);
})();
