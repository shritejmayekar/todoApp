
var app = angular.module('todoApp')
  .controller('logoutController',function($http,$auth,$state,$mdToast,httpService) {
    /**************************************
    * Logout controller to logout the user
    ***************************************/
    $auth.logout();
    localStorage.removeItem('Token');
    $mdToast.show(
      $mdToast.simple()
      .textContent('Logout success...')
      .position('top right')
      .hideDelay(3000)
    );
     $state.go('login');
  })
