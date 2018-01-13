'use strict';
module.exports = function(app) {
  var todoApp = require('../controller/todoController');

  // todoApp register  Routes
  app.route('/register')
    .get(todoApp.list_of_user)
    .post(todoApp.register_a_user);

  app.route('/register/:userId')
    .get(todoApp.read_a_user)
    .put(todoApp.update_a_user)
    .delete(todoApp.delete_a_user);

  // todoApp login routes
  app.route('/login')
    .post(todoApp.login_a_user);
  app.route('/logout')
    .get(todoApp.logout_a_user);

  //note CRUD routes
  app.route('/note')
    .post(todoApp.create_a_note);

  app.route('/display')
    .get(todoApp.display_a_note);

  app.route('/note/:noteId')
    .get(todoApp.read_a_note)
    .put(todoApp.update_a_note)
    .delete(todoApp.delete_a_note);

  app.route('/listnote')
    .get(todoApp.note_all_title);

  //token routes
  app.route('/auth/me')
    .get(todoApp.get_token);

};
