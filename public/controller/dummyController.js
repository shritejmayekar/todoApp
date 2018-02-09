var app = angular.module('todoApp')
app.controller('dummyController', function($scope, $state, httpService, $location, $http) {

  var token = $location.absUrl().split('/dummyPage/')[1];
  console.log($location.absUrl().split('/dummyPage/')[1]);
  $http.defaults.headers.common['x-access-token'] = "Bearer " + token;

  httpService.httpServiceFunction('GET', '/auth/authenticate').then(function(res) {
    var email;
    try {
      if (res.data.google.email == undefined) {
        email = res.data.facebook.name
        console.log(email);
      } else {
        email = res.data.google.email
      }
    } catch (e) {
      console.log(e);
      email = res.data.facebook.name
    } finally {

    }
    localStorage.Token = JSON.stringify({
      token: token,
      date: Date(),
      email: email
    })
    localStorage.setItem('satellizer_token', token)
    $state.go('home')
  })

})
