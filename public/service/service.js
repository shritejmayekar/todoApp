var app = angular.module('todoApp');
//login service
app.service('loginService', function($http) {
  this.signinFunction = function(email, password) {
    return $http({
      method: 'POST',
      url: '/login',
      data: {
        email: email,
        password: password
      },
      headers:new Headers()
    })
  }
});
//register service
app.service('registerService',function($http) {
  this.registerFunction = function(name,email,password,recoveryEmail) {
    return $http({
      method:'POST',
      url:'/register',
      data:{
        name:name,
        email:email,
        password:password,
        recoveryEmail:recoveryEmail

      }

    })
  }
})
//forgot password service
app.service('forgotPasswordService',function($http) {
  this.forgotPasswordFunction = function(email) {
    return $http({
      method:'POST',
      url:'/auth/forgot_password',
      data:{
        email:email
      }
    })
  }
})
//save note
app.service('saveNoteService',function($http) {
  this.save = function(title,note,email) {
    return $http ({
      method:'POST',
      url:'/note',
      data:{
        title:title,
        note:note,
        email:email
      }
    })
  }
})
app.service('deleteNoteService',function($http) {
  this.save = function(noteObj) {
    return $http ({
      method:'DELETE',
      url:'/note/'+noteObj._id

    })
  }
})
app.service('updateNoteService',function($http) {
  this.update = function(noteObj,result) {
    return $http ({
      method:'PUT',
      url:'/note/'+noteObj._id,
      data:{
        note:result,
        edited:'Edited:'+Date()
      }

    })
  }
})
