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
        templateUrl: 'src/home/homeView.html',
        url:'/',
        controller: 'HomeCtrl'
      })
      .state('signup', {
        templateUrl: 'src/signup/signupView.html',
        url:'/signup',
        controller: 'SignupCtrl'
      })
      .state('profile', {
        templateUrl: 'src/profile/profileView.html',
        url:'/profile/:username',
        controller: 'ProfileCtrl'
      });

  }]);


})();
