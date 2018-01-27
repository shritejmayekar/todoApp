
var app = angular.module('todoApp')
  .controller('logoutController',function($http,$auth,$state,$mdToast,httpService) {
    $auth.logout();
    $state.go('login')
  /*  if(localStorage.Token) {
      var get_token = JSON.parse(localStorage.Token);

      console.log(Date(7000));
    if(get_token.date) {
    httpService.httpServiceFunction('GET','/logout').then(function(res) {
        console.log(res);
        localStorage.Token = JSON.stringify({token:"",date:""});
        $mdToast.show(
          $mdToast.simple()
          .textContent('Logout success...')
          .position('top right')
          .hideDelay(3000)
        );
        $state.go('login');
      });
    }
    else {
      $state.go('login');
    }


} */
  })
