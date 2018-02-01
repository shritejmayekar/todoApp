var router = require('express').Router();
var noteController = require('../controller/noteController')
// create notes of user
router.post('/create',noteController.create);
// read all notes of user
router.get('/read',noteController.readNote);
// update notes of user
router.put('/update/:noteId',noteController.update);
// deleate notes of user
router.delete('/delete/:noteId',noteController.delete);
//set reminder
router.post('/reminder',noteController.reminder);

module.exports = router;
