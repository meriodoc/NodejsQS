var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

// this is to check if user is logged in ... before they can access the login page
router.get('/profile', isLoggedIn, function(req, res, next) {
  // Here i want to retrieve the order data for the logged in user - form Mongoose - Change to mssql
  // AND display it on the user's profile page
  // might want to look for id in mssql because mongoose is clever enough to do this auto
  Order.find({user: req.user}, function(err, orders) {
    if (err) {
      return res.write('QS Error!');
    }
    // Here I want to get the cart from that order
    var cart;
    // and loop through all the orders
    // I generate a new cart for each order below
    orders.forEach(function(order) {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
    });
    // Then I can render my response - user/profile
    // And then pass the objects to the view
    res.render('user/profile', { orders: orders });
  });
});
// this is to check if user is logged in ... before they can access the login page
router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  res.redirect('/');
});
router.use('/', notLoggedIn, function(req, res, next) {
  next();
});
// Register route START
router.get('/register', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/register', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/register', passport.authenticate('local.register', {
  failureRedirect: '/user/register',
  failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
      // Extract the old url first otherwise null will crash
      var oldUrl = req.session.oldUrl;
      // this code has to be above the redirect -- Done!
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/user/profile');
    }
});
// Register route END
// thankyou route START
router.get('/thankyou', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/thankyou', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/thankyou', passport.authenticate('local.thankyou', {
  failureRedirect: '/user/thankyou',
  failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
      // Extract the old url first otherwise null will crash
      var oldUrl = req.session.oldUrl;
      // this code has to be above the redirect -- Done!
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/user/thankyou');
    }
});


// Thankyou route END
// Contact route START
router.get('/contact', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/contact', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/contact', passport.authenticate('local.contact', {
  failureRedirect: '/user/contact',
  failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
      // Extract the old url first otherwise null will crash
      var oldUrl = req.session.oldUrl;
      // this code has to be above the redirect -- Done!
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/user/profile');
    }
});


// Contact route END



router.get('/signup', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
  // TESTING
  successRedirect: '/user/profile',
  // TESTING END
  failureRedirect: '/user/signup',
  failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
      // Extract the old url first otherwise null will crash
      var oldUrl = req.session.oldUrl;
      // this code has to be above the redirect -- Done!
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/user/profile');
    }
});


router.get('/signin', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
router.post('/signin', passport.authenticate('local.signin', {
  // TESTING
  successRedirect: '/',
  // TESTING END
  failureRedirect: '/user/signin',
  failureFlash: true
}), function(req, res, next) {
    if (req.session.oldUrl) {
      // Extract the old url first otherwise null will crash
      var oldUrl = req.session.oldUrl;
      // this code has to be above the redirect -- Done!
      req.session.oldUrl = null;
      res.redirect(oldUrl);
    } else {
      res.redirect('/user/profile');
      res.redirect('/shop/shopping-cart');
    }
});



module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}


// QS custom middleware to make routes above  secure and passport will manage this
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
