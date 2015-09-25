(function() {
  'use strict';

  angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngFileUpload',
    'app.home',
    'app.profile',
    'app.signup'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        templateUrl: 'src/home/home.html',
        url:'/',
        controller: 'HomeCtrl'
      })
      .state('signup', {
        templateUrl: 'src/signup/signup.html',
        url:'/signup',
        controller: 'SignupCtrl'
      })
      .state('profile', {
        templateUrl: 'src/profile/profile.html',
        url:'/profile/:username',
        controller: 'ProfileCtrl'
      });

  }]);


})();
