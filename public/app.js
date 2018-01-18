var app = angular.module('todoApp',['ui.router','ngMaterial']);
app.config(function($stateProvider,$urlRouterProvider) {
  $stateProvider
    .state('login',{
      url:'/login',
      templateUrl:'/template/login.html',
      controller:'loginController'
    }
  )
  .state('home',{
    url:'/home',
    templateUrl:'template/home.html',
    controller:'homeController'

  })
  .state('register',{
    url:'/register',
    templateUrl:'template/register.html',
    controller:'registerController'
  })
   .state('logout',{
      url:'/logout',
      controller:'logoutController'
    })
    .state('forgotPassword',{
      url:'/forgotPassword',
      templateUrl:'/template/forgotPassword.html',
      controller:'forgotPasswordController'

    });
  $urlRouterProvider.otherwise('/login');
})
