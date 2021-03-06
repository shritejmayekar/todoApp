var router = require('express').Router();
var noteController = require('../controller/noteController')
var userController = require('../controller/userController');

// create notes of user
router.post('/create', noteController.create);

// read all notes of user
router.get('/read', noteController.readNote);

// update notes of user
router.put('/update/:noteId', noteController.update);

// deleate notes of user
router.delete('/delete/:noteId', noteController.delete);

//set reminder
router.post('/reminder', noteController.reminder);

// store collaborator notes relationship
router.post('/collab/:noteId', noteController.collab);

// get the collaborated Notes
router.get('/collabsNote', noteController.collaboratedNote);

// remove the collabarated Notes
router.put('/removeCollab/:noteId', noteController.collaborateRemove);

// add label to the user
router.post('/addLabel', noteController.addLabel);

// display/get  all the labels
router.get('/getLabel', noteController.getLabel);

// remove label from the note
router.delete('/removeLabel/:label', noteController.removeLabel);

module.exports = router;
