var app = angular.module('todoApp');
app.controller('homeController', function($scope, $sce, $mdDialog, $state, $timeout,
  $mdSidenav, $http,  $mdToast, httpService, $interval, $filter) {

  //  $scope.toggleLeft = buildToggler('left');
  //$scope.toggleRight = buildToggler('right');
  $scope.options = ['transparent','#FF8A80', '#FFD180', '#FFFF8D', '#CFD8DC', '#80D8FF', '#A7FFEB', '#CCFF90'];
  //$scope.color = '#FF8A80';
  $scope.color = 'default';
  $scope.themeColor = [ 'default','dark-red','dark-orange','dark-yellow','dark-grey','dark-purple','dark-blue','dark-green'];
  $scope.colorChanged = function(newColor, oldColor) {
      console.log('from ', oldColor, ' to ', newColor);
      $scope.color = $scope.themeColor[$scope.options.indexOf(newColor)];
      $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
      var data = {
        note_color: $scope.themeColor[$scope.options.indexOf(newColor)]
      }
  }

$scope.getProfile = function() {
  $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
  httpService.httpServiceFunction('GET','/auth/authenticate').then(function(res) {
    $scope.imageProfile =res.data.local.profile;
  })

}
$scope.img_avatar = function() {
    getProfile();
}

  $scope.getProfile();
  /************************************
   * List View / Grid View
   ************************************/
  var count = 0;
  $scope.listGrid = function() {
    if (count % 2 == 0) {
      $scope.setView = 'column';
    } else {
      $scope.setView = 'row';
    }

    count++;
  }
  /*************************************
   * Nav bar
   *************************************/
  var navCount = 0;
  $scope.navClick = function() {
    if (navCount % 2 == 0) {
      document.getElementById("mySidenav").style.width = "225px";
      document.getElementById("main").style.marginLeft = "225px";
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
  /***********************************
   * Take a Note div  show / hide
   ***********************************/
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


  /**************************************
   * noteFunction to GET / READ all Notes
   ***************************************/
  var noteFunction = function() {
    var get_email = JSON.parse(localStorage.Token).email;
    httpService.httpServiceFunction('GET', '/note/read').then(function(res) {
      console.log(res.data);
      var list_notes = res.data;
      $scope.listOfNotes = res.data;
      remind();
    });
  }

  noteFunction();


  /***************************************
   * saveNote function to CREATE / SAVE Notes
   ****************************************/
  $scope.saveNote = function() {
    var get_email = JSON.parse(localStorage.Token).email;
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
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
  /***********************************
   *Delete note function to DELETE notes
   ************************************/
  $scope.deleteNote = function(note) {
    console.log(note._id);
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    httpService.httpServiceFunction('delete', '/note/delete/' + note._id, null).then(function(res) {
      console.log(res);
      noteFunction();
    })
  }
  /*************************************
   * copyNote function to copy existing as
   *  new Note
   *************************************/
  $scope.copyNote = function(note) {
    var get_email = JSON.parse(localStorage.Token).email;
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    var new_note = note;
    console.log(new_note);
    var data = {
      title: new_note.title,
      note: new_note.note,
      email: get_email
    }
    console.log(get_email);
    httpService.httpServiceFunction('POST', '/note/create', data).then(function(res) {
      console.log(res);
      noteFunction();

    })
  }
  /*************************************
   * reminderNote function set the Reminder
   *************************************/
  $scope.reminderNote = function(note, time) {
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    console.log(time);
    var data = {
      reminder: time
    }
    httpService.httpServiceFunction('put', '/note/update/' + note._id, data).then(function(res) {
      noteFunction();
    })
  }
  /******************************
   * remind function take call to
   * check all Notes reminder
   *******************************/
  var remind = function() {
    console.log($scope.listOfNotes);
    for (var i = 0; i < $scope.listOfNotes.length; i++) {
      remainderCheck($scope.listOfNotes[i]);
    }
  }
  /*******************************
   * Check the Each Note Reminder
   ********************************/
  var remainderCheck = function(note) {
    $interval(function() {
        date = new Date();
        //console.log($filter('date')(note.reminder, "short") + '\n' +
        //$filter('date')(date, "short"));
        if ($filter('date')(note.reminder, "short") == $filter('date')(date, "short")) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Reminder success...')
            .position('center')
            .hideDelay(6000)
          )
          note.reminder = null;
          var data = {
            reminder: null
          }
          httpService.httpServiceFunction('put', '/note/update/' + note._id, data).then(function(res) {
            noteFunction();
          })
        }
      },
      1000);
  }
  /***************************************
  * change the theme of the notes
  ***************************************/
  $scope.changeTheme = function (note) {
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;

    var data = {
      note_color : $scope.color
    }
    httpService.httpServiceFunction('put', '/note/update/' + note._id,data).then(function(res) {
      console.log(res);
      noteFunction();
    })
  }
  /*****************************************
  * editNote function Edited / UPDATE Notes
  *****************************************/
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
        httpService.httpServiceFunction('put', '/note/update/' + ev._id, answer).then(function(res) {
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
  }
  /************************************
  * Archieve note function to make note
  * Archieve / Unarchieve
  *************************************/
  $scope.archieveNote = function(note) {
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    var data = {
      is_archieved:note.is_archieved?'false':'true'
    }
    httpService.httpServiceFunction('put', '/note/update/' + note._id,data).then(function(res) {
      //  archieveNoteService.update(note, 'true').then(function(res) {
      console.log(res);
      noteFunction();
    })

  };
  /*********************************
  * pinNote function to pin a note
  **********************************/
  $scope.pinNote =  function(note) {
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    var data = {

      is_pinned:note.is_pinned? 'false':'true'
    }
    httpService.httpServiceFunction('put','/note/update/'+note._id,data).then(function(res) {
      console.log(res);
      noteFunction();
    })

  }
  /********************************************
  * trashNote function to delete note temporary
  **********************************************/
  $scope.trashNote = function(note) {
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    var data = {

      is_deleted:note.is_deleted? 'false':'true'
    }
    httpService.httpServiceFunction('put','/note/update/'+note._id,data).then(function(res) {
      console.log(res);
      noteFunction();
    })
  }

})
