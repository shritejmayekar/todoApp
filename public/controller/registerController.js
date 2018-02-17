var app = angular.module('todoApp')
  .controller('registerController', function($scope,$location, $auth, $mdToast, httpService, $state, $http) {

    $('#spinner').hide();
    $scope.register = function() {
      if ($scope.registerForm.fname == "" || $scope.registerForm.fname == null ||
      $scope.registerForm.lname == "" || $scope.registerForm.lname == null ||
        $scope.registerForm.email == "" ||   $scope.registerForm.email == null ||
        $scope.registerForm.password == "" || $scope.registerForm.password == null
        || $scope.registerForm.confirmPassword ==""  || $scope.registerForm.confirmPassword ==null
        || $scope.registerForm.recoveryEmail == "" || $scope.registerForm.recoveryEmail== null) {
        return false;
      }
      if ($scope.registerForm.password != $scope.registerForm.confirmPassword) {
        return false;
      }
      $('#spinner').show();
      var data = {
        name: $scope.registerForm.fname+ ' '+$scope.registerForm.lname,
        email: $scope.registerForm.email,
        password: $scope.registerForm.password,
        recovery_email: $scope.registerForm.recoveryEmail

      }
      $auth.signup(data).then(function(res) {
          console.log(res);
          if (res.data.authenticate) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('Register success...')
              .position('top right')
              .hideDelay(3000)
            );
            Push.create("Register Success!", {
              body: 'Please verify Email by clicking Link',
              //  icon: '/icon.png',
            //  icon: $scope.imageProfile,
              timeout: 4000,
              onClick: function() {
                window.focus();
                this.close();
              }
            });
            $state.go('home');
          } else {
            document.getElementById('flag').innerHTML = "<p style='color:red'>There was a problem registering the user</p>"
            $('#spinner').hide();

          }
        })
        .catch(function(res) {
          console.log(res);
          document.getElementById('flag').innerHTML = "<p style='color:red'>There was a problem registering the user</p>"
          $('#spinner').hide();

        });
    }
    console.log($location.url());

  });
