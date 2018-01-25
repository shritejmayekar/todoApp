var app =angular.module('todoApp');
  app.controller('homeController', function($scope, $sce, $mdDialog, $state, $timeout,
    $mdSidenav, $http, deleteNoteService, saveNoteService, updateNoteService, httpService) {
    var data = {
      headers: {
        'x-access-token': JSON.parse(localStorage.Token).token
      }
    }

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    var count = 0;
    $scope.listGrid = function() {
      if (count % 2 == 0) {
        $scope.setView = 'column';
      } else {
        $scope.setView = 'row';
      }

      count++;
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

      $http({
        method: 'POST',
        url: '/listnote',
        data: {
          email: get_email
        }
      }).then(function(res) {
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

      //    title = $('<div/>').html(title).text()
      var note = document.getElementById('note').innerHTML;
      //  var postText = note;
      //  postText = postText.replace(/\n/g, '<br>\n');
      //  var post = document.createElement('p');
      //  post.innerHTML = post.innerHTML.replace(/\n/g, '<br>\n'); // <-- THIS FIXES THE LINE BREAKS
      //  console.log(postText);
      //  var  html = note.join('<br />');

      //note = $("<div/>").html(note).text()
      //postText = $("<div/>").html(postText).text()
      saveNoteService.save(title, note, get_email).then(function(res) {
        console.log(res);
        console.log(get_email);
        noteFunction();
        show();

      })
    }
    $scope.deleteNote = function(note) {
      console.log(note._id);
      deleteNoteService.save(note).then(function(res) {
        console.log(res);
        noteFunction();
      })
    }
    $scope.copyNote = function(note) {
      var get_email = JSON.parse(localStorage.Token).email;
      var new_note = note;
      console.log(new_note);
      saveNoteService.save(new_note.title, new_note.note, get_email).then(function(res) {
        console.log(res);
        console.log(get_email);
        noteFunction();

      })
    }

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
          console.log(answer);
          updateNoteService.update(ev, answer).then(function(res) {
            console.log(res);
            noteFunction();
          })

        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    function DialogController($scope, $rootScope, $mdDialog, $sce) {
      $scope.title = noteObj.title;
      $scope.note = noteObj.note;
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

      archieveNoteService.update(note, 'true').then(function(res) {
        console.log(res);
        noteFunction();
      })

    };

  })
