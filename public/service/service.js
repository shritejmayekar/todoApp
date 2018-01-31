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
