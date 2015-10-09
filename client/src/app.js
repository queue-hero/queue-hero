(function() {
  'use strict';

  angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'ngFileUpload',
    'ngCookies',
    'ngMessages',
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
      })
      .state('signup', {
        templateUrl: 'src/components/signup/signup.html',
        url:'/signup',
      })
      .state('profile', {
        templateUrl: 'src/components/profile/profile.html',
        url:'/profile',
      })
      .state('choice', {
        templateUrl: 'src/components/choice/choice.html',
        url:'/choice',
      })
      .state('hero_location', {
        templateUrl: 'src/components/hero_location/location.html',
        url:'/hero/location',
      })
      .state('hero_task', {
        templateUrl: 'src/components/hero_task/task.html',
        url: '/hero/task',
      })
      .state('hero_order', {
        url: '/hero/order',
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
        views: {
          '': {
            templateUrl: 'src/components/requester_order/order.html'
          },
          'details@requester_order': {
            templateUrl: 'src/components/requester_order/partial-details.html'
          },
          'complete@requester_order': {
            templateUrl: 'src/components/requester_order/partial-complete.html'
          },
          'rate@requester_order': {
            templateUrl: 'src/components/requester_order/partial-rate.html'
          }
        }
      });
      $httpProvider.interceptors.push('redirect');

  }])
  .factory('redirect', ['$window', '$location', function($window, $location) {

    var attach = {
      response: function(object) {
        console.log(object.status, object.status === 401);
        if (object.status === 401) {
          $location.path('/');
        }
        return object;
      }
    };
    return attach;
  }])
  .run(['$rootScope', '$state', '$cookies', 'heroFactory', 'requesterFactory', function($rootScope, $state, $cookies, heroFactory, requesterFactory) {
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
      var cookie = $cookies.get('connect.sid');
      if (toState.name === 'signup' && fromState.name === '' && !cookie) {
        evt.preventDefault();
        $cookies.remove('connect.sid');
        $state.go('home');
        return;
      }

      if (!cookie) {
        if (toState.name !== 'home' && toState.name !== 'signup') {
          evt.preventDefault();
          $state.go('home');
        }
      }

    });

    var options = {
      enableHighAccuracy: true,
      timeout: 15000,
      // use cached coordinates if previous call was within 30 seconds
      maximumAge: 30000
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

    function success(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      heroFactory.setOrder({ currentLocation: [lat, long] });
      requesterFactory.setOrder({ currentLocation: [lat, long] });
    }

    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }

  }]);

})();
