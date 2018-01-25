angular.module('todoApp')
  .controller('resetController', function($scope, $state, $mdToast, $http,httpService, resetPasswordService) {
    $scope.resetPassword = function() {
      if ($scope.resetPasswordForm.newPassword == null ||
        $scope.resetPasswordForm.newPassword == "" ||
        $scope.verifyPasswordForm.newPassword == "" ||
        $scope.verifyPasswordForm.newPassword == null)
        return false;
      if ($scope.resetPasswordForm.newPassword != $scope.verifyPasswordForm.newPassword) {
        document.getElementById('flag').innerHTML = '<p style="color:red">enter same password</p>';
        return false;
      }
      var data = {
        newPassword:$scope.resetPasswordForm.newPassword,
        verifyPassword:$scope.verifyPasswordForm.newPassword
      }
      httpService.httpServiceFunction('POST', JSON.parse(localStorage.Token).url,data).then(function(res) {
        console.log(res);
        if (res.data.message == 'Password reset') {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Reset Password success...')
            .position('top right')
            .hideDelay(3000)
          );
          localStorage.Token = JSON.stringify({
            url:undefined
          })
          $state.go('login');
        } else {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Something went wron...')
            .position('top right')
            .hideDelay(3000)
          );
        }


      })



    }

  })
