angular
  .module('todoApp')
  .controller('homeController', function($scope,$mdDialog, $state, $timeout,
    $mdSidenav, $http,deleteNoteService, saveNoteService,updateNoteService) {

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    $scope.listGrid = function () {

    }
    $scope.openNav =function() {
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
  }

  $scope.closeNav =function () {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft= "0";
  }

    function buildToggler(componentId) {
      return function() {
        document.getElementById("mySidenav").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        $mdSidenav(componentId).toggle();
      };
    }
    var noteFunction = function() {
    var get_email = JSON.parse(localStorage.Token).email;
      $http({
        method: 'POST',
        url: '/listnote',
        data:{
          email:get_email
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
      saveNoteService.save($scope.title, $scope.note,get_email).then(function(res) {
        console.log(res);
        console.log(get_email);
        noteFunction();
        $scope.title="";
        $scope.note="";
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
      saveNoteService.save(new_note.title,new_note.note,get_email).then(function(res) {
      console.log(res);
      console.log(get_email);
      noteFunction();

    })
    }
    $scope.editNote = function(note) {

    var confirm = $mdDialog.prompt()
      .textContent(note.title)
      .placeholder('note')
      .ariaLabel('note')
      .initialValue(note.note)
      .targetEvent(note)
      .required(true)
      .ok('Done')
      .clickOutsideToClose(true);


    $mdDialog.show(confirm).then(function(result) {
      console.log(result);
      updateNoteService.update(note,result).then(function(res) {
        console.log(res);
        noteFunction();
      })

    }, function() {
      console.log("edit cancel");
    });
  };
  });
