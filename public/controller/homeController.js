var app = angular.module('todoApp');
app.controller('homeController', function($scope, $sce, $mdDialog, $state, $timeout,
  $mdSidenav, $http, $mdToast, httpService, $interval, $filter) {

  /**********************
   * Set Note color
   **********************/
  $scope.pinNote = "";
  //  $scope.toggleLeft = buildToggler('left');
  //$scope.toggleRight = buildToggler('right');
  $scope.options = ['transparent', '#FF8A80', '#FFD180', '#FFFF8D', '#CFD8DC', '#80D8FF', '#A7FFEB', '#CCFF90'];
  //$scope.color = '#FF8A80';
  $scope.color = 'default';
  $scope.themeColor = ['default', 'dark-red', 'dark-orange', 'dark-yellow', 'dark-grey', 'dark-purple', 'dark-blue', 'dark-green'];
  $scope.colorChanged = function(newColor, oldColor) {
    console.log('from ', oldColor, ' to ', newColor);
    $scope.color = $scope.themeColor[$scope.options.indexOf(newColor)];
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    var data = {
      note_color: $scope.themeColor[$scope.options.indexOf(newColor)]
    }
  }
  /*************************************
   * set myCroppedImage Profile pics
   ************************************/
  $scope.getProfile = function() {
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    httpService.httpServiceFunction('GET', '/auth/authenticate').then(function(res) {
      $scope.imageProfile = res.data.local.profile;
    })

  }
  $scope.img_avatar = function() {
    getProfile();
  }

  $scope.getProfile();
  $scope.myImage = '';
  $scope.myCroppedImage = '';
  // handle image cropping
  var handleFileSelect = function(evt) {
    var file = evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function(evt) {
      $scope.$apply(function($scope) {
        $scope.myImage = evt.target.result;

      });
    };
    console.log($scope.myImage);
    reader.readAsDataURL(file);
  };
  angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
  $scope.setProfile = function(profilePic) {

    var data = {
      'local.profile': profilePic
    }
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    httpService.httpServiceFunction('PUT', '/auth/profilePic', data).then(function(res) {
      $scope.getProfile();
      $scope.myImage = '';
      $scope.myCroppedImage = '';

    })
  }
  /**********************************************
   * Label function to set labels
   ***********************************************/

  var self = this;
  // get the user labels
  var getLabel = function() {
    httpService.httpServiceFunction('get', '/note/getLabel').then(function(res) {
      $scope.listLabel = res.data;
      console.log(res.data);
      self = $scope.listLabel;
    })
  }
  getLabel();
  // remove the label form the notes
  $scope.labelClick = function(note, label) {
    httpService.httpServiceFunction('put', '/note/update/' + note._id, {
      $pull: {
        label: label
      }
    }).then(function(res) {
      console.log(res);
      noteFunction();
    })
  }
  // remove the user labels from user
  $scope.removeLabel = function(label) {
    httpService.httpServiceFunction('delete', '/note/removeLabel/' + label).then(function(res) {
      getLabel();
      for (var i = 0; i < $scope.listOfNotes.length; i++) {

        httpService.httpServiceFunction('put', '/note/update/' + $scope.listOfNotes[i]._id, {
          $pull: {
            label: label
          }
        }).then(function(res) {

        })
      }

      noteFunction();
    })
  }
  $('#pinned').hide();
  $('#other').hide();



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
  $scope.noteID = function(note) {
    $scope.imageURL = note;
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
      try {
        httpService.httpServiceFunction('GET', '/note/collabsNote').then(function(res) {
          console.log(res.data);
          var list_notes = res.data;
          $scope.collabsNotes = res.data;
          $scope.listOfNotes = $scope.collabsNotes.concat($scope.listOfNotes);
        });

      } catch (e) {
        $scope.listOfNotes = $scope.collabsNotes;

      }
      remind();
      for (var i = 0; i < $scope.listOfNotes.length; i++) {
        if ($scope.listOfNotes[i].is_pinned) {
          $('#pinned').show();
          $('#other').show();
          break;
        } else {
          $('#pinned').hide();
          $('#other').hide();
        }
      }
    });
  }
  noteFunction();


  /***************************************
   * saveNote function to CREATE / SAVE Notes
   ****************************************/
  $scope.saveNote = function(image) {
    var get_email = JSON.parse(localStorage.Token).email;
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    console.log(document.getElementById('div1').innerHTML);
    var title = document.getElementById('title').innerHTML;
    var note = document.getElementById('note').innerHTML;

    var data = {
      title: title,
      note: note,
      email: get_email,
      picture: image
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
      $mdToast.show(
        $mdToast.simple()
        .textContent('Note deleted permanently...')
        .position('bottom right')
        .hideDelay(3000)
      );
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

      $mdToast.show(
        $mdToast.simple()
        .textContent('Note Copied success...')
        .position('bottom right')
        .hideDelay(3000)
      );

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
      //reminderBackend($scope.listOfNotes[i]);
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
          /*    $mdToast.show(
                $mdToast.simple()
                .textContent('Reminder success...')
                .position('bottom')
                .hideDelay(3000)
              )*/
          Push.create("Reminder!", {
            body: note.note,
            //  icon: '/icon.png',
            icon: $scope.imageProfile,
            timeout: 4000,
            onClick: function() {
              window.focus();
              this.close();
            }
          });
          note.reminder = null;
          var data = {
            reminder: null
          }
          httpService.httpServiceFunction('put', '/note/update/' + note._id, data).then(function(res) {
            noteFunction();
          })
        }
      },
      10000);
  }
  /***************************************
   * change the theme of the notes
   ***************************************/
  $scope.changeTheme = function(note) {
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;

    var data = {
      note_color: $scope.color
    }
    httpService.httpServiceFunction('put', '/note/update/' + note._id, data).then(function(res) {
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
          $mdToast.show(
            $mdToast.simple()
            .textContent('Note Edited...')
            .position('bottom right')
            .hideDelay(3000)
          );

        })
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
  };

  function DialogController($scope, $rootScope, $mdDialog, $sce) {
    $scope.title = noteObj.title;
    $scope.title1 = noteObj.title;
    //$scope.getNote = noteObj;
    $scope.note = $("<div/>").html(noteObj.note).text();
    $scope.note1 = noteObj.note;
    $scope.noteObject = noteObj;


    //$scope.title.titleNote =  noteObj.title;
    //  $scope.note.description= noteObj.note;

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
    $scope.copyNote = function(data) {
      var get_email = JSON.parse(localStorage.Token).email;
      data.email = get_email;
      $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
      console.log(get_email);
      httpService.httpServiceFunction('POST', '/note/create', data).then(function(res) {
        console.log(res);
        noteFunction();
        $mdToast.show(
          $mdToast.simple()
          .textContent('Note Copied...')
          .position('bottom right')
          .hideDelay(3000)
        );

      })
    }
    /************************************
     * Archieve note function to make note
     * Archieve / Unarchieve
     *************************************/
    $scope.archieveNote = function(note) {
      $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
      var data = {
        is_archieved: note.is_archieved ? 'false' : 'true'
      }
      httpService.httpServiceFunction('put', '/note/update/' + note._id, data).then(function(res) {
        //  archieveNoteService.update(note, 'true').then(function(res) {
        console.log(res);
        var noteOperation = note.is_archieved ? 'Unarchieved' : 'Archived';
        noteFunction();
        $mdToast.show(
          $mdToast.simple()
          .textContent(noteOperation)
          .position('bottom right')
          .hideDelay(3000)
        );
      })

    };
    /********************************************
     * trashNote function to delete note temporary
     **********************************************/
    $scope.trashNote = function(note) {
      $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
      var data = {

        is_deleted: note.is_deleted ? 'false' : 'true'
      }
      httpService.httpServiceFunction('put', '/note/update/' + note._id, data).then(function(res) {
        console.log(res);
        noteFunction();
        var noteOperation = note.is_deleted ? 'Restored' : 'Trashed';

        $mdToast.show(
          $mdToast.simple()
          .textContent(noteOperation)
          .position('bottom right')
          .hideDelay(3000)
        );
      })
    }
  }
  /************************************
   * Archieve note function to make note
   * Archieve / Unarchieve
   *************************************/
  $scope.archieveNote = function(note) {
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    var data = {
      is_archieved: note.is_archieved ? 'false' : 'true'
    }
    httpService.httpServiceFunction('put', '/note/update/' + note._id, data).then(function(res) {
      //  archieveNoteService.update(note, 'true').then(function(res) {
      console.log(res);
      var noteOperation = note.is_archieved ? 'Unarchieved' : 'Archived';
      noteFunction();
      $mdToast.show(
        $mdToast.simple()
        .textContent(noteOperation)
        .position('bottom right')
        .hideDelay(3000)
      );
    })

  };
  /*********************************
   * pinNote function to pin a note
   **********************************/
  $scope.pinNote = function(note) {
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    var data = {

      is_pinned: note.is_pinned ? 'false' : 'true'
    }
    httpService.httpServiceFunction('put', '/note/update/' + note._id, data).then(function(res) {
      console.log(res);
      noteFunction();
      var noteOperation = note.is_pinned ? 'Unpinned' : 'Pinned';
      $mdToast.show(
        $mdToast.simple()
        .textContent(noteOperation)
        .position('bottom right')
        .hideDelay(3000)
      );
    })

  }
  /********************************************
   * trashNote function to delete note temporary
   **********************************************/
  $scope.trashNote = function(note) {
    $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;
    var data = {

      is_deleted: note.is_deleted ? 'false' : 'true'
    }
    httpService.httpServiceFunction('put', '/note/update/' + note._id, data).then(function(res) {
      console.log(res);
      noteFunction();
      var noteOperation = note.is_deleted ? 'Restored' : 'Trashed';

      $mdToast.show(
        $mdToast.simple()
        .textContent(noteOperation)
        .position('bottom right')
        .hideDelay(3000)
      );
    })
  }
  var noteObj1;
  $scope.collabsNote = function(ev) {
    noteObj1 = ev;
    $mdDialog.show({
        controller: DialogControllerCollab,
        initialValue: ev,
        templateUrl: 'template/dialogCollabNote.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      })
      .then(function(answer) {
        if (answer.email == undefined) {
          return false;
        }
        answer.edited = new Date();
        //answer.collaborator_id = answer.email;
        console.log(answer);
        httpService.httpServiceFunction('post', '/note/collab/' + ev._id, answer).then(function(res) {
          console.log(res);
          noteFunction();
        })

      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
  };
  /*****************************************
   * Dialog Collab Controller inside home controller
   *******************************************/
  function DialogControllerCollab($scope, $rootScope, $mdDialog, $sce) {
    $scope.title = noteObj1.title;
    //$scope.getNote = noteObj;
    $scope.note = noteObj1.note;
    $scope.noteObject = noteObj1;
    //$scope.note = $("<div/>").html(noteObj.note).text()
    //  $scope.note =  $sce.trustAsHtml(noteObj.note);
    console.log($scope.title);
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.removeCollabs = function(note) {
      $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;

      httpService.httpServiceFunction('put', '/note/removeCollab/' + note._id, ).then(function(res) {
        noteFunction();
      })

    }
    $scope.answer = function(answer) {

      $mdDialog.hide(answer);
    };

  }
  /*****************************************
   * Label function to add labels
   *****************************************/
  var labelObj;
  var listLabelObj = $scope.listLabel;
  $scope.addLabel = function(ev) {
    labelObj = ev;
    $mdDialog.show({
        controller: dialogLabelController,
        initialValue: ev,
        templateUrl: 'template/dialogLabel.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      })
      .then(function(answer) {
        //answer.edited = new Date();
        if (answer == undefined || answer == null) return false;
        console.log(answer);
        $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;

        httpService.httpServiceFunction('post', '/note/addLabel', {
          answer
        }).then(function(res) {
          noteFunction();
          console.log(res);
          getLabel();
        })
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
  };

  function dialogLabelController($scope, $rootScope, $mdDialog, $sce) {
    //  $scope.title = labelObj.title;
    //$scope.getNote = noteObj;
    //  $scope.note = labelObj.note;
    $scope.noteObject = listLabelObj;
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


  var labelNoteObj;
  $scope.labelAdd = function(ev) {
    labelNoteObj = ev;
    $mdDialog.show({
        controller: dialogAddLabelController,
        initialValue: ev,
        templateUrl: 'template/dialogLabelAdd.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      })
      .then(function(answer) {
        //answer.edited = new Date();
        if (answer == undefined || answer == null) return false;
        console.log(answer, labelNoteObj._id);
        $http.defaults.headers.common['x-access-token'] = "Bearer " + JSON.parse(localStorage.Token).token;

        httpService.httpServiceFunction('put', '/note/update/' + labelNoteObj._id, {
          $push: answer
        }).then(function(res) {
          noteFunction();
        })
        $mdDialog.hide();


      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
  };

  function dialogAddLabelController($scope, $rootScope, $mdDialog, $sce) {
    $scope.note = labelNoteObj;
    //$scope.getNote = noteObj;
    //  $scope.note = labelObj.note;
    //  $scope.noteObject = listLabelObj;
    //$scope.note = $("<div/>").html(noteObj.note).text()
    //  $scope.note =  $sce.trustAsHtml(noteObj.note);var getLabel =  function() {

    httpService.httpServiceFunction('get', '/note/getLabel').then(function(res) {
      $scope.listLabel = res.data;
      console.log(res.data);
      noteFunction();
    })

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
    $scope.removeLabel = function(answer) {
      console.log(answer);
      httpService.httpServiceFunction('put', '/note/update/' + labelNoteObj._id, {
        $pull: {
          label: answer
        }
      }).then(function(res) {
        console.log(res);
        noteFunction();
      })
      $mdDialog.hide();
    }



  }
  /*
    var socket = io.connect();
    var reminderBackend = function(note) {
    socket.emit('reminder check',note,function() {

    });
    socket.on('get reminder',note,function(){

          Push.create("Reminder!", {
          body: note.note,
          //  icon: '/icon.png',
          icon: $scope.imageProfile,
          timeout: 4000,
          onClick: function() {
            window.focus();
            this.close();
          }
          });
    })
  }*/
})
