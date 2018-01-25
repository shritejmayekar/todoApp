var app = angular.module('todoApp',['ui.router','ngMaterial','ngAnimate','ngSanitize','satellizer']);
app.filter('html',['$sce',function($sce) {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}])
app.config(function($authProvider) {
  $authProvider.google({
    clientId: '920690214427-ruo8tp6479ksl0f7sqb53ro6fg11e477.apps.googleusercontent.com',

    url: '/auth/google',

 authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
 redirectUri: 'http://localhost:3000/home',
 requiredUrlParams: ['scope'],
 optionalUrlParams: ['display'],
 scope: ['profile', 'email'],
 scopePrefix: 'openid',
 scopeDelimiter: ' ',
 display: 'popup',
 oauthType: '2.0',
 popupOptions: { width: 452, height: 633 }
  });

  $authProvider.facebook({
    clientId:'139717613365382',
  name: 'todoApp',
  url: '/auth/facebook',
  authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
  redirectUri: 'http://localhost:3000/auth/facebook/callback',
  requiredUrlParams: ['display', 'scope'],
  scope: ['email'],
  scopeDelimiter: ',',
  display: 'popup',
  oauthType: '2.0',
  popupOptions: { width: 580, height: 400 }
});
})

app.config(function($stateProvider,$urlRouterProvider,$locationProvider,$authProvider) {
/**
  helper function
*/
   var skipIfLoggedIn =['$q','$auth',function($q,$auth) {
     var defered = $q.defer();
     if($auth.isAuthenticated()) {
       defered.reject();
     } else {
       defered.resolve();
     }
     return defered.promise;
   }]
   var loginIsRequired = ['$q,','$location','$auth', function($q,$location,$auth) {
     var defered = $q.defer();
     if($auth.isAuthenticated()) {
       defered.resolve();
     } else {
       $location.path('/login');
     }
     return defered.promise;
   }]



  $stateProvider
    .state('login',{
      url:'/login',
      templateUrl:'/template/login.html',
      controller:'loginController',
      resolve:{
        skipIfLoggedIn:skipIfLoggedIn
      }
    }
  )
  .state('home',{
    url:'/home',
    templateUrl:'template/home.html',
    controller:'homeController',
    resolve:{
      loginIsRequired:loginIsRequired
    }

  })
  .state('register',{
    url:'/register',
    templateUrl:'template/register.html',
    controller:'registerController',
    resolve:{
      skipIfLoggedIn:skipIfLoggedIn
    }
  })
   .state('logout',{
      url:'/logout',
      controller:'logoutController'
    })
    .state('forgotPassword',{
      url:'/forgotPassword',
      templateUrl:'/template/forgotPassword.html',
      controller:'forgotPasswordController'

    })
    .state('resetPassword',{
      url:'/resetPassword',
      templateUrl:'/template/resetPassword.html',
      controller:'resetController'
    })




  $urlRouterProvider.otherwise('/login');
//  $locationProvider.html5Mode(true);
})
