'use strict';
// all routes
module.exports = function(app) {
  var passport = require('passport');
  var jwt = require('jwt-simple');


  var todoApp = require('../controller/todoController');

  app.get('/', function(req, res) {

    res.sendFile(__dirname + "index.html");
  });
  // route for social login
  app.get('/account', ensureAuthenticated, function(req, res) {
    User.findById(req.session.passport.user, function(err, user) {
      if (err) {
        console.log(err); // handles error
      } else {
      res.json(req.user);
      //res.redirect('/');
  /*    var token = jwt.encode({
        id: req.user._id
      }, 'secret', {
        expiresIn: 86400 // expires in 24 hours
      });
      res.json({
        authenticate: true,
        token: token,
        message: 'Login success'
      }); */
      }
    })

  });
  // route to check user is authenticated by social login
  app.get('/auth/check',ensureAuthenticated,function(req,res) {
    console.log(req);
    var data = {
      user:req.user,
      status:true,
      message:'user authenticated'
    }
    res.json(data);
  })
// route to authenticate user by social login
// Google login route
  app.get('/auth/google',
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
      ]
    }));
// route to get google callback
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/'
    }),
    function(req, res) {
      res.redirect('/account');
    });
// route to authenticate user by facebook login
  app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function(req, res) {});
// route to get facebook callback
  app.get('/auth/facebook/callback',
    //passport.authenticate('facebook', {
      //failureRedirect: '/'
    //}),
    //function(req, res) {
    //  res.redirect('/account');
    passport.authenticate('facebook',
    {session: false, failureRedirect: '/' }),
       function(req, res, next) {
           var token = jwt.encode(req.user, 'secret');
           //res.redirect("/home/"+token);
          res.json('fb'+token);
    });
  // route to logout a  user
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  app.get('/',isLoggedIn, function(req, res) {
          res.redirect('/#' + req.url);
      });

  // test authentication
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
  function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
      return next();
    } else {
      res.writeHead(403);
      res.end();
    }
  }

  // todoApp register  Routes
  app.route('/register')
    .get(todoApp.list_of_user)
    .post(todoApp.register_a_user);
  app.route('/auth/signup')
    .post(todoApp.register_a_user)

  app.route('/register/:userId')
    .get(todoApp.read_a_user)
    .put(todoApp.update_a_user)
    .delete(todoApp.delete_a_user);

  // todoApp login routes
  app.route('/login')
    .post(todoApp.login_a_user);
    app.route('/auth/login')
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
  app.route('note/reminder/:noteId')
    .put(todoApp.set_a_reminder);

  app.route('/listnote')
    .post(todoApp.note_all_title);

  app.route('/update/user/:userId')
    .put(todoApp.update_a_user);



  //token routes
  app.route('/auth/me')
    .get(todoApp.get_token);
    app.route('/user')
      .get(todoApp.get_token);
  app.route('/auth/user')
    .post(todoApp.get_token_auth);

  app.route('/auth/forgot_password')
    .post(todoApp.forgot_password);
  app.route('/auth/reset_password')
    .get(todoApp.reset_get)
    .post(todoApp.reset_password);
};
