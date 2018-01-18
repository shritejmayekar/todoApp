var app = angular.module('todoApp')
    .controller('forgotPasswordController',function($scope,$state,forgotPasswordService){

      $scope.forgotPassword = function() {
        if($scope.forgotPasswordForm.email == null || $scope.forgotPasswordForm.email =="")
          return false;
          forgotPasswordService.forgotPasswordFunction($scope.forgotPasswordForm.email)
          .then(function(res) {
            console.log(res);
          })
      }
    })
