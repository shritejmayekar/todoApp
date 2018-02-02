var app = angular.module('todoApp')
  .controller('loginController', function($scope,$location, $auth, $mdToast, $http, $state, httpService) {
    /*
        if (localStorage.Token) {
          var get_token = JSON.parse(localStorage.Token);
          console.log(get_token.token);
          console.log(get_token.date);
          if (get_token.date) {
            authService.get_tokenFunction(get_token.token).then(function(res) {
              console.log(res);
              if (res.data.authenticate) {
                $state.go('home');
              }
              if (res.data.authenticate == false) {
                $state.go('login');
              }

            });
          }
        }*/
     // httpService.httpServiceFunction('GET','/auth/facebook/callback'+$location.absUrl().split('?token=')[1]).then(function(res) {
     //      //  console.log(res.data.message);
     //        console.log(res);
     //      //  console.log(res.data.user);
     //      /*  if(res.data.message == 'user authenticated') {
     //          localStorage.Token = JSON.stringify( {
     //            token: res.data.token,
     //            date: Date(),
     //            email: res.data.user.name
     //          })
     //
     //          $state.go('home');
     //
     //        }*/
     //    })
  

       console.log($auth.isAuthenticated());
    $scope.authenticate = function(provider) {
     $auth.authenticate(provider).then(function(){
       console.log(provider);
       $state.go('home');
     })
     .catch(function(res) {
       console.log(res);
     });
   };


    console.log($auth.isAuthenticated());

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


        }
        else {
          document.getElementById('flag').innerHTML = "<p style='color:red'>name or password is wrong</p>";
        }
      }).catch(function(res) {
        console.log(res);
        document.getElementById('flag').innerHTML = "<p style='color:red'>user not found</p>";

      })

    }
  })
