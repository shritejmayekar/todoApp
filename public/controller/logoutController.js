
var app = angular.module('todoApp')
  .controller('logoutController',function($http,$state,$mdToast) {
    if(localStorage.Token) {
      var get_token = JSON.parse(localStorage.Token);

      console.log(Date(7000));
    if(get_token.date) {
      $http({
        method:'GET',
        url:'/logout'

      }).then(function(res) {
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


    }
  })
