'use strict';

module.exports = function(app) {
  var todoApp = require('../controller/todoController');
  app.get('/', function(req, res) {

    res.sendFile(__dirname + "index.html");
  });

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
    .post(todoApp.note_all_title);

  app.route('/update/user/:userId')
    .put(todoApp.update_a_user);



  //token routes
  app.route('/auth/me')
    .get(todoApp.get_token);
  app.route('/auth/user')
    .post(todoApp.get_token_auth);

  app.route('/auth/forgot_password')
    .post(todoApp.forgot_password);
  app.route('/auth/reset_password')
    .get(todoApp.reset_get)
    .post(todoApp.reset_password);
  //  app.route('/auth/forgot_password')
  //    .get(todoApp.render_forgot_password_template)
  //    .post(todoApp.forgot_password);
  //  app.route('/auth/reset_password')
  //    .get(todoApp.render_reset_password_template)
  //    .post(todoApp.reset_password);

};
