var app = angular.module('todoApp')
  .controller('registerController', function($scope, $auth, $mdToast, httpService, $state, $http) {

    $scope.register = function() {
      if ($scope.registerForm.fname == "" || $scope.registerForm.email == "" ||
        $scope.registerForm.password == "" || $scope.registerForm.confirmPassword == "" || $scope.registerForm.recoveryEmail == "") {
        return false;
      }
      if ($scope.registerForm.password != $scope.registerForm.confirmPassword) {
        return false;
      }
      var data = {
        name: $scope.registerForm.fname,
        email: $scope.registerForm.email,
        password: $scope.registerForm.password,
        recoveryEmail: $scope.registerForm.recoveryEmail

      }
      /*
    httpService.httpServiceFunction('POST','/register',data).then(function(res) {
        if (res == 'There was a problem registering the user') {
          document.getElementById('flag').innerHTML = "<p style='color:red'>There was a problem registering the user</p>"

        } else {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Register success...')
            .position('top right')
            .hideDelay(3000)
          );
          $state.go('login');
        }
      });
        */

      $auth.signup(data).then(function(res) {
          console.log(res);
          if (res.data.authenticate) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Register success...')
              .position('top right')
              .hideDelay(3000)
            );
            $state.go('home');
          } else {
            document.getElementById('flag').innerHTML = "<p style='color:red'>There was a problem registering the user</p>"

          }
        })
        .catch(function(res) {
          console.log(res);

        });
    }
  });
