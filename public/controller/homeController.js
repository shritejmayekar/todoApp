var app = angular.module('todoApp');
app.controller('homeController', function($scope, $sce, $mdDialog, $state, $timeout,
  $mdSidenav, $http, httpService, $interval) {

  //  $scope.toggleLeft = buildToggler('left');
  //$scope.toggleRight = buildToggler('right');
  var count = 0;
  $scope.listGrid = function() {
    if (count % 2 == 0) {
      $scope.setView = 'column';
    } else {
      $scope.setView = 'row';
    }

    count++;
  }

  var navCount = 0;
  $scope.navClick = function() {
    if (navCount % 2 == 0) {
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
    } else {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
    }

    navCount++;
  }
  $scope.openNav = function() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  onDocumentClick = function(event) {
    if ($scope.closeFlag) {
      $scope.closeFlag = true;
      return;
    }
  }

  $scope.closeNav = function() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }

  function buildToggler(componentId) {
    return function() {
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
      $mdSidenav(componentId).toggle();
    };
  }

  document.getElementById('showDiv').style.visibility = "hidden";
  $scope.hide = function() {
    document.getElementById('div1').style.visibility = "hidden";

    document.getElementById('showDiv').style.visibility = "visible"
  }
  var show = function() {
    document.getElementById('title').innerHTML = "";
    document.getElementById('note').innerHTML = ""
    document.getElementById('div1').style.visibility = "visible";
    document.getElementById('showDiv').style.visibility = "hidden "
  }




  var noteFunction = function() {
    var get_email = JSON.parse(localStorage.Token).email;


    httpService.httpServiceFunction('GET', '/note/read').then(function(res) {
      console.log(res.data);
      var list_notes = res.data;
      $scope.listOfNotes = res.data;
    });
  }
  noteFunction();
  $scope.saveNote = function() {
    var get_email = JSON.parse(localStorage.Token).email;
    console.log(document.getElementById('div1').innerHTML);
    var title = document.getElementById('title').innerHTML;
    var note = document.getElementById('note').innerHTML;
    var data = {
      title: title,
      note: note,
      email: get_email
    }
    httpService.httpServiceFunction('POST', '/note/create', data).then(function(res) {
      console.log(res);
      console.log(get_email);
      noteFunction();
      show();

    })
  }
  $scope.deleteNote = function(note) {
    console.log(note._id);
    httpService.httpServiceFunction('delete', '/note/delete/' + note._id, null).then(function(res) {
      console.log(res);
      noteFunction();
    })
  }
  $scope.copyNote = function(note) {
    var get_email = JSON.parse(localStorage.Token).email;
    var new_note = note;
    console.log(new_note);
    var data = {
      title: new_note.title,
      note: new_note.note,
      email: get_email
    }
    httpService.httpServiceFunction('POST', '/note/create', data).then(function(res) {
      console.log(res);
      console.log(get_email);
      noteFunction();

    })
  }
  // reminder


  $scope.reminderNote = function(note, time) {


    console.log(time);
    var data = {
      reminder: time
    }
    httpService.httpServiceFunction('put', 'note/update/' + note._id, data).then(function(res) {
      noteFunction();
    })

    remainderCheck(note);
  }
/*
  var myInterval = setInterval(function() {
    myTimer()
  }, 10);

  function myTimer() {
    $scope.theTime = new Date("dd MMM yyyy HH:mm a");
    console.log($scope.theTime);
    if ($scope.theTime == note.reminder) {
      alert('hello');
      clearInterval(myVar);
    }
  }
  */
  var remainderCheck = function(note) {
    var date = new Date();
    $scope.theTime = new Date("dd MMM yyyy HH:mm a");
    console.log($scope.theTime + '\n' + note.reminder);
    alert('reminder')


  }
  // color check

  var noteObj;
  $scope.editNote = function(ev) {
    noteObj = ev;
    $mdDialog.show({
        controller: DialogController,
        initialValue: ev,
        templateUrl: 'template/dialogEditNote.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      })
      .then(function(answer) {
        answer.edited = new Date();
        console.log(answer);
        httpService.httpServiceFunction('put', 'note/update/' + ev._id, answer).then(function(res) {
          noteFunction();
        })

      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
  };

  function DialogController($scope, $rootScope, $mdDialog, $sce) {
    $scope.title = noteObj.title;
    //$scope.getNote = noteObj;
    $scope.note = noteObj.note;
    $scope.noteObject = noteObj;

    //$scope.note = $("<div/>").html(noteObj.note).text()
    //  $scope.note =  $sce.trustAsHtml(noteObj.note);
    console.log($scope.title);
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {

      $mdDialog.hide(answer);
    };
    //    $scope.answer = function() {
    //    $scope.note.title
    //  $scope.note.note
    //  };
  }
  $scope.archieveNote = function(note) {
    httpService.httpServiceFunction('put', '/note/update/' + note._id, 'true').then(function(res) {
      //  archieveNoteService.update(note, 'true').then(function(res) {
      console.log(res);
      noteFunction();
    })

  };

})
