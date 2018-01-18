var app = angular.module('todoApp')
  .controller('loginController', function($scope, $mdToast, $http, $state, loginService) {

    if (localStorage.Token) {
      var get_token = JSON.parse(localStorage.Token);
      console.log(get_token.token);
      console.log(get_token.date);
      if (get_token.date) {
        $http({
          method: 'POST',
          url: '/auth/user',
          data: {
            token: get_token.token,
            date: Date()
          }
        }).then(function(res) {
          console.log(res);
          if (res.data.authenticate) {
            $state.go('home');
          }
          if(res.data.authenticate == false) {
            $state.go('login');
          }

        });
      }


    }


    $scope.login = function() {
      if ($scope.loginForm.email == "" || $scope.loginForm.email == null ||
        $scope.loginForm.password == "" || $scope.loginForm.password == null)
        return false;
        var email = $scope.loginForm.email;
      loginService.signinFunction($scope.loginForm.email, $scope.loginForm.password).then(function(res) {
        console.log(res.data.authenticate);
        if (res.data.authenticate) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Login success...')
            .position('top right')
            .hideDelay(3000)
          );

          localStorage.Token = JSON.stringify({
            token: res.data.token,
            date: Date(),
            email:email
          });
          $state.go('home');
        } else {
          document.getElementById('flag').innerHTML = "<p style='color:red'>name or password is wrong</p>";

        }
      })
      $scope.loginForm.email = "";
      $scope.loginForm.password = "";

    }
  })
