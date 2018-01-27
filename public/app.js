var app = angular.module('todoApp', ['ui.router', 'ngMaterial', 'ngAnimate', 'ngSanitize', 'satellizer']);
app.filter('html', ['$sce', function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}])
app.run(function($trace) {
  $trace.enable('TRANSITION');
});
app.config(function($authProvider) {

  $authProvider.facebook({
    clientId: '139717613365382',
    responseType: 'token'
  });
  $authProvider.google({
    clientId: '920690214427-ruo8tp6479ksl0f7sqb53ro6fg11e477.apps.googleusercontent.com'
  });
})
app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
  /**
    helper function
  */
  var skipIfLoggedIn = ['$q', '$auth', function($q, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.reject();
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }];

  var loginRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
    var deferred = $q.defer();
    if ($auth.isAuthenticated()) {
      deferred.resolve();
    } else {
      $location.path('/login');

    }
    return deferred.promise;
  }];


  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/template/login.html',
      controller: 'loginController',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('home', {
      url: '/home',
      templateUrl: 'template/home.html',
      controller: 'homeController',
      resolve: {
        loginRequired: loginRequired
      }

    })
    .state('register', {
      url: '/register',
      templateUrl: 'template/register.html',
      controller: 'registerController',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
    })
    .state('logout', {
      url: '/logout',
      controller: 'logoutController'
    })
    .state('forgotPassword', {
      url: '/forgotPassword',
      templateUrl: '/template/forgotPassword.html',
      controller: 'forgotPasswordController'

    })
    .state('resetPassword', {
      url: '/resetPassword',
      templateUrl: '/template/resetPassword.html',
      controller: 'resetController'
    })




  $urlRouterProvider.otherwise('/home');
  //  $locationProvider.html5Mode(true);
})
