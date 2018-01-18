var app = angular.module('todoApp')
  .controller('registerController', function($scope, $mdToast, $state, $http, registerService) {

    $scope.register = function() {
      registerService.registerFunction($scope.registerForm.fname, $scope.registerForm.email,
        $scope.registerForm.password, $scope.registerForm.recoveryEmail).then(function(res) {
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

    }
  });
