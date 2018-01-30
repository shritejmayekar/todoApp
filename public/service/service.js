var app = angular.module('todoApp');

//common service get and post
app.service('httpService',function($http) {
  this.httpServiceFunction = function(method,url,data) {
    if(method == 'get' || method == 'GET') {
      this.params = data;
      this.data = this.params;
    }
    else {
      this.data = data;
    }
    return $http({
      method:method,
      url:url,
      data:data
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
//auth users
app.service('authService',function($http) {
  this.get_tokenFunction = function(token) {
    return  $http({
          method: 'POST',
          url: '/auth/user',
          data: {
            token: token,
            date: Date()
          }
        })
  }
})
// reset password service
app.service('resetPasswordService',function($http) {
  this.resetFunction = function(newPassword,verifyPassword,url) {
    return $http({
      method:'POST',
      //url:'http://localhost:3000/auth/reset_password?token=' + token,
      url:url,
      data: {
        newPassword:newPassword,
        verifyPassword:verifyPassword,

      }
    })
  }
})
//save note
app.service('saveNoteService',function($http) {
  this.save = function(title,note,email) {
    return $http ({
      method:'POST',
      url:'/note/create',
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
        note:result.note,
        title:result.title,
        edited:'Edited:'+Date()
      }

    })
  }
})
app.service('archieveNoteService',function($http) {
  this.update = function(noteObj,archieve) {
    return $http ({
      method:'PUT',
      url:'/note/'+noteObj._id,
      data:{
        is_archieved:archive,
        edited:'Edited:'+Date()
      }

    })
  }
})
