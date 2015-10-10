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
    'app.requester_order',
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
  .factory('redirect', ['$q', '$location', '$cookies', function($q, $location, $cookies) {
    var attach = {
      response: function(response) {
        return response || $q.when(response);
      },
      responseError: function(rejection) {
        if (rejection.status === 403) {
          $cookies.remove('connect.sid');
          $location.path('/');
        }
        return $q.reject(rejection);
      }
    };
    return attach;
  }])
  .run(['$rootScope', '$state', '$cookies', 'heroFactory', 'requesterFactory', '$window', function($rootScope, $state, $cookies, heroFactory, requesterFactory, $window) {
    $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {
      var cookie = $cookies.get('connect.sid');
      if (cookie && toState.name === 'home' || (toState.name === 'signup' && fromState.name != '')) {
        evt.preventDefault();
        $state.go('choice');
      } else if (!cookie && toState.name !== 'home' && toState.name !== 'signup') {
        evt.preventDefault();
        $state.go('home');
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


    var sessionHeroOrder = $window.JSON.parse($window.sessionStorage.getItem('heroOrder'));
    if( sessionHeroOrder !== null ) {
      heroFactory.setOrder(sessionHeroOrder);
      console.log('default hero order loaded');
    }

    var sessionReqOrder = $window.JSON.parse($window.sessionStorage.getItem('requesterOrder'));
    if( sessionReqOrder !== null ) {
      requesterFactory.setOrder(sessionReqOrder);
      console.log('default req order loaded');
    }

    $rootScope.$watch(function() {
      return heroFactory.getOrder();
    }, function watchCallback(newVal, oldVal) {
      var stringObject = $window.JSON.stringify(newVal);
      $window.sessionStorage.setItem('heroOrder',stringObject);
      console.log(newVal);
    }, true);

    $rootScope.$watch(function() {
      return requesterFactory.getOrder();
    }, function watchCallback(newVal, oldVal) {
      var stringObject = $window.JSON.stringify(newVal);
      $window.sessionStorage.setItem('requesterOrder',stringObject);
      console.log(newVal);
    }, true);



  }]);

})();
