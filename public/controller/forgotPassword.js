// forgot password controller
var app = angular.module('todoApp')
  .controller('forgotPasswordController', function($scope, $state, httpService) {
    //forgotPassword function
    $('#spinner').hide();
    $scope.forgotPassword = function() {
      //checking value null or undefined
      $scope.$emit('passwordReset','data');
      if ($scope.forgotPasswordForm.email == null || $scope.forgotPasswordForm.email == "")
        return false;
        $('#spinner').show();

      var data = {
        email: $scope.forgotPasswordForm.email
      }
      httpService.httpServiceFunction('POST', '/auth/forgotPassword', data)
        .then(function(res) {
          if (res.data.messages == "message send to email") {
            document.getElementById('flag').innerHTML = "<h4 style='color:green'> " +
              "Message send to Email<br>Please Check your Email";
          }
          $('#spinner').hide();

        })
    }
  })
