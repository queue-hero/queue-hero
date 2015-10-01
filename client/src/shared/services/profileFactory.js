(function() {
  'use strict';

  angular.module('app')
  .factory('profileFactory', [function() {
    var profile = {};

    return {
      getProfile: getProfile,
      setProfile: setProfile
    };

    function getProfile() {
      return profile;
    }

    function setProfile(updatedProfile) {
      profile = updatedProfile;
    }

  }]);

})();
