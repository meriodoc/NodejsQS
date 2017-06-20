var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local');

// QS stored ID area for me to retrieve id
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
  done(err, user);
  });
});
// New signup strategy  (middleware) for a new  user 1. config Javascript object 2. callback
passport.use('local.signup', new LocalStrategy({
  usernameField: 'CustomerCode',
  passwordField: 'MobileNumber',
  passReqToCallback: true
}, function(req, CustomerCode, MobileNumber, done) {
  req.checkBody('CustomerCode', 'Invalid customer code').notEmpty();
  req.checkBody('MobileNumber', 'Invalid mobile number').notEmpty();
  var errors = req.validationErrors();
    if (errors) {
      var messages = [];
      errors.forEach(function(error) {
        messages.push(error.msg);
      });
      return done(null, false, req.flash('error', messages));
    }
  User.findOne({'CustomerCode':CustomerCode}, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      return done(null, false, {message: 'customer code is already in use'});
    }
    var newUser = new User();
    newUser.CustomerCode = CustomerCode;
    newUser.MobileNumber = newUser.encryptPassword(MobileNumber);
    newUser.save(function(err, result){
      if (err) {
        return done(err);
      }
      return done(null, newUser);
    });
  });
}));
// QS New signin strategy  (middleware) for an existing user 1. config Javascript object 2. callback
passport.use('local.signin', new LocalStrategy({
  usernameField: 'CustomerCode',
  passwordField: 'MobileNumber',

  passReqToCallback: true
}, function(req, CustomerCode, MobileNumber, done){

  req.checkBody('CustomerCode', 'Invalid customer code').notEmpty();
  req.checkBody('MobileNumber', 'Invalid mobile number').notEmpty();
  var errors = req.validationErrors();
    if (errors) {
      var messages = [];
      errors.forEach(function(error) {
        messages.push(error.msg);
      });
      return done(null, false, req.flash('error', messages));
    }
    // user is the user I found in the db - fix this for QS
    User.findOne({'CustomerCode':CustomerCode}, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {message: 'No customer code found!'});
      }
      if (!user.validPassword(MobileNumber)) {
        return done(null, false, {message: 'Wrong mobile number!'});
      }
      return done(null, user);
    });
}));
