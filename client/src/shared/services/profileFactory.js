(function() {
  'use strict';

  angular.module('app')
  .factory('profileFactory', [function() {
    var profile = {};

    return {
      getProfile: getProfile,
      setProfile: setProfile
    };


    function getProfile(keys) {
      if(keys === undefined){
        return profile;
      }

      if(angular.isArray(keys)){
        var results = {};
        for(var i = 0; i < keys.length; i++){
          if(keys[i] in profile){
            results[keys[i]] = profile[keys[i]];
          }else{
            results[keys[i]] = null;
          }
        }
        return results;
      }

      if(angular.isString(keys)){
        if(keys in profile){
          return profile[keys];
        }
      }

      return null;
    }


    function setProfile(obj) {
      if(!angular.isObject(obj)){
        return null;
      }
      var allValidKeys = true;
      for(var key in obj){
        if(key in profile){
          profile[key] = obj[key];
        }else{
          allValidKeys = false;
        }
      }
      return allValidKeys;
    }

  }]);

})();
