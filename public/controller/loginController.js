var app = angular.module('todoApp')
  .controller('loginController', function($scope,$interval, $location, $auth, $mdToast, $http, $state, httpService) {
    Notification.requestPermission(function(status) {
        console.log('Notification permission status:', status);
    function displayNotification() {
      if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
          var options = {
            body: 'Here is a notification body!',
            icon: 'images/example.png',
            vibrate: [100, 50, 100],
            data: {
              dateOfArrival: Date.now(),
              primaryKey: 1
            }
          };
          reg.showNotification('Hello world!', options);
        });
      }
    }
    });
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider).then(function() {
          console.log(provider);
          $state.go('home');
        })
        .catch(function(res) {
          console.log(res);
        });
    };
    /*****************************
    *Login function with an auth
    ******************************/
    $scope.login = function() {
      if ($scope.loginForm.email == "" || $scope.loginForm.email == null ||
        $scope.loginForm.password == "" || $scope.loginForm.password == null)
        return false;
      var email = $scope.loginForm.email;
      var data = {
        email: $scope.loginForm.email,
        password: $scope.loginForm.password
      }
      $auth.login(data).then(function(res) {
        console.log(res);
        console.log(res.data.authenticate);

        if (res.data.authenticate) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Login success...')
            .position('top right')
            .hideDelay(3000)
          )

          localStorage.Token = JSON.stringify({
            token: res.data.token,
            date: Date(),
            email: res.data.email
          })
          $state.go('home');


        } else {
          document.getElementById('flag').innerHTML = "<p style='color:red'>name or password is wrong</p>";
        }
      }).catch(function(res) {
        console.log(res);
        document.getElementById('flag').innerHTML = "<p style='color:red'>user not found</p>";

      })

    }


  })
