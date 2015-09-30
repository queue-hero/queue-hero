(function() {
  'use strict';

  angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngFileUpload',
    'app.home',
    'app.profile',
    'app.signup',
    'app.choice'
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
        url:'/profile',
        controller: 'ProfileCtrl'
      })
      .state('choice', {
        templateUrl: 'src/choice/choice.html',
        url:'/choice',
        controller: 'ChoiceCtrl'
      })
      .state('hero_location', {
        templateUrl: 'src/hero_location/location.html',
        url:'/hero/location',
        controller: 'HeroLocationCtrl'
      })
      .state('hero_task', {
        templateUrl: 'src/hero_task/task.html',
        url: '/hero/task',
        controller: 'HeroTaskCtrl'
      })
      .state('hero_order', {
        url: 'hero/order',
        views: {
          '': {
            templateUrl: 'src/hero_order/order.html'
          },
          'details@hero_order': {
            templateUrl: 'src/hero_order/partial-details.html'
          },
          'complete@hero_order': {
            templateUrl: 'src/hero_order/partial-complete.html'
          }
        },
        controller: 'HeroOrderCtrl'
      });

  }]);


})();
