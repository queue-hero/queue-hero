(function() {
  'use strict';

  angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngFileUpload',
    'ngCookies',
    'app.home',
    'app.profile',
    'app.signup',
    'app.choice',
    'app.hero_location',
    'app.hero_task',
    'app.hero_order',
    'app.requester_task',
    'app.requester_order'
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        templateUrl: 'src/components/home/home.html',
        url:'/',
        controller: 'HomeCtrl'
      })
      .state('signup', {
        templateUrl: 'src/components/signup/signup.html',
        url:'/signup',
        controller: 'SignupCtrl'
      })
      .state('profile', {
        templateUrl: 'src/components/profile/profile.html',
        url:'/profile',
        controller: 'ProfileCtrl'
      })
      .state('choice', {
        templateUrl: 'src/components/choice/choice.html',
        url:'/choice',
        controller: 'ChoiceCtrl'
      })
      .state('hero_location', {
        templateUrl: 'src/components/hero_location/location.html',
        url:'/hero/location',
        controller: 'HeroLocationCtrl'
      })
      .state('hero_task', {
        templateUrl: 'src/components/hero_task/task.html',
        url: '/hero/task',
        controller: 'HeroTaskCtrl'
      })
      .state('hero_order', {
        url: '/hero/order',
        controller: 'HeroOrderCtrl',
        views: {
          '': {
            templateUrl: 'src/components/hero_order/order.html'
          },
          'details@hero_order': {
            templateUrl: 'src/components/hero_order/partial-details.html'
          },
          'complete@hero_order': {
            templateUrl: 'src/components/hero_order/partial-complete.html'
          }
        }
      })
      .state('requester_task', {
        url: '/requester/task',
        controller: 'RequesterTaskCtrl',
        views: {
          '': {
            templateUrl: 'src/components/requester_task/task.html'
          },
          'location@requester_task': {
            templateUrl: 'src/components/requester_task/partial-location.html'
          },
          'item@requester_task': {
            templateUrl: 'src/components/requester_task/partial-item.html'
          },
          'time_price@requester_task': {
            templateUrl: 'src/components/requester_task/partial-time_price.html'
          },
          'confirm@requester_task': {
            templateUrl: 'src/components/requester_task/partial-confirm.html'
          }
        }
      })
      .state('requester_order', {
        url: '/requester/order',
        controller: 'RequesterOrderCtrl',
        views: {
          '': {
            templateUrl: 'src/components/requester_order/order.html'
          },
          'details@requester_order': {
            templateUrl: 'src/components/requester_order/partial-details.html'
          },
          'complete@requester_order': {
            templateUrl: 'src/components/requester_order/partial-complete.html'
          }
        }
      });
  }])
  .run(['$rootScope', '$state', '$cookies', function($rootScope, $state, $cookies) {
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
      var cookie = $cookies.get('com.queuehero');
      if (!cookie) {
        if (toState.name !== 'home' && toState.name !== 'signup') {
          evt.preventDefault();
          $state.go('home');
        }
      }else{
        if (toState.name === 'home') {
          evt.preventDefault();
          $state.go('choice');
        }
      }
    });

  }]);

})();
