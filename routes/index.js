var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
// to use as middleware
var Product = require('../models/product');
var Customer = require('../models/customer');
var Order = require('../models/order');

// Testing counter START

// Testing counter STOP

/* GET QS home/Landing page. */
router.get('/', function( req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function (err, docs) {
    var productChunks = [];
    var chunkSize = 3;

/*
    docs =[
      {imagePath:'', title:'foo',price:99.90,id:'345'},
      {imagePath:'', title:'bar',price:99.90,id:'345'},
      {imagePath:'', title:'baz',price:99.90,id:'345'}
    ];

*/

    for (var i = 0; i < docs.length; i += chunkSize) {
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'shopping-cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
  });
});

router.get('/add-to-cart/:id', function(req, res, next) {
  var productId = req.params.id;
  // This is to make sure that if i already have a cart in session that else pass empty cart session
  var cart  = new Cart(req.session.cart ? req.session.cart :{});

  // THis is mongoose method to find prouct by id SEE mssql equivolent
                              // Callback function
  Product.findById(productId, function(err, product) {
      if (err) {
        return res.redirect('/');
      }
        // then pass the product I just fetched from the db and create the idetifier
      cart.add(product, product.id);
    //  Then here I'm storing it in my cart in my session
    // Express will auto save this in db...so i don't need to do it here.
    req.session.cart = cart;
    // Just to see this I'm logging the session cart below
    console.log(req.session.cart);

    // Then redirect to product page
    res.redirect('/');
  });
});
// Reduce ON Index START
router.get('/reducecart/:id', function(req, res, next) {
  var productId = req.params.id;
  // This is to make sure that if i already have a cart in session that else pass empty cart session
  var cart  = new Cart(req.session.cart ? req.session.cart :{});

  cart.reduceByOneCart(productId);
  // Then store my cart in the session again
  req.session.cart = cart;
  //Then redirect the user to the index router
  res.redirect('/');

});
// Reduce ON Index STOP

// Reduce ON cart START
router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  // This is to make sure that if i already have a cart in session that else pass empty cart session
  var cart  = new Cart(req.session.cart ? req.session.cart :{});

  cart.reduceByOne(productId);
  // Then store my cart in the session again
  req.session.cart = cart;
  //Then redirect the user to the shopping cart router
  res.redirect('/shopping-cart');
});
// Reduce ON cart STOP
// Plus function router
router.get('/increase/:id', function(req, res, next) {
  var productId = req.params.id;
  // This is to make sure that if i already have a cart in session that else pass empty cart session
  var cart  = new Cart(req.session.cart ? req.session.cart :{});

  cart.increaseByOne(productId);
  // Then store my cart in the session again
  req.session.cart = cart;
  //Then redirect the user to the shopping cart router
  res.redirect('/shopping-cart');
});

// Plus end

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  // This is to make sure that if i already have a cart in session that else pass empty cart session
  var cart  = new Cart(req.session.cart ? req.session.cart :{});

  cart.removeItem(productId);
  // Then store my cart in the session again
  req.session.cart = cart;
  //Then redirect the user to the shopping cart router
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart' ,function(req, res, next) {
  // This is to see if there are products in my cart
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products: null});
  }
  // If I pass this test to see that there is products in the cart
  // then create a new cart of the cart stored in my session
  var cart = new Cart(req.session.cart);
  // Then render die shopping cart view here AND pass some arguments
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});


});

// ConfirmOrder GET START
router.get('/confirmorder', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  // This first element in the array comes from the fact that I'm only using one error messages
  // so... it will be the first element 0 in the array
  var errMsg = req.flash('error')[0];
  // !errMsg will be true if we don't have any errors
  res.render('shop/confirmorder', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});
// ConfirmOrder GET STOP

// ConfirmOrder POST Start
router.post('/confirmorder', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);


  order.save(function(err, result) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/confirmorder');
    }
    // If successful flash this message into a success object
    req.flash('success', 'Successfully bought product');
    // Then clear the cart
    req.session.cart = null;
    // Redirect to shop/ index.hbs page (Landing page) if successful
    res.redirect('/');
  });
});

// ConfirmOrder POST Stop
// Checkout  start
router.get('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  // This first element in the array comes from the fact that I'm only using one error messages
  // so... it will be the first element 0 in the array
  var errMsg = req.flash('error')[0];
  // !errMsg will be true if we don't have any errors
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
  "sk_test_jsYULFUnbpuxDBK88HyLZJA2"
);

stripe.charges.create({
  amount: cart.totalPrice * 100,
  currency: "zar",
  source: req.body.stripeToken, // obtained with Stripe.js
  description: "QS test charge"
}, function(err, charge) {
  // asynchronously called
  // If error...flash this message from stripe and redirect to checkout page
  if (err) {
    req.flash('error', err.message);
    return res.redirect('/checkout');
  }
// Creating new order and save it to the database
var order = new Order({
  // then paas a javascript object as an argument that will initialize the order
  // passport will place  this user passport on the request
  // so i can always access this user object from anywhere in my app
  user: req.user,
  cart: cart,
  // add name to checkout.hbs ie.<input type="text" id="address" class="form-control" required name="address">
  // because im using the name field to access it
  // req.body is where express stores the values sent with a post request
  address: req.body.address,
  name: req.body.name,
  // can retrieve the paymentId from my charge object which get passed above to the callback line 78 above
  paymentId: charge.id
});
  order.save(function(err, result) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    // If successful flash this message into a success object
    req.flash('success', 'Successfully bought product');
    // Then clear the cart
    req.session.cart = null;
    // Redirect to shop/ index.hbs page (Landing page) if successful
    res.redirect('/');
  });
});
});
// Checkout  end

// Checkout new start
router.get('/checkoutthankyou', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  // This first element in the array comes from the fact that I'm only using one error messages
  // so... it will be the first element 0 in the array
  var errMsg = req.flash('error')[0];
  // !errMsg will be true if we don't have any errors
  res.render('shop/checkoutthankyou', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkoutthankyou', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")(
  "sk_test_jsYULFUnbpuxDBK88HyLZJA2"
);

stripe.charges.create({
  amount: cart.totalPrice * 100,
  currency: "zar",
  source: req.body.stripeToken, // obtained with Stripe.js
  description: "QS test charge"
}, function(err, charge) {
  // asynchronously called
  // If error...flash this message from stripe and redirect to checkout page
  if (err) {
    req.flash('error', err.message);
    return res.redirect('/checkoutthankyou');
  }
// Creating new order and save it to the database
var order = new Order({
  // then paas a javascript object as an argument that will initialize the order
  // passport will place  this user passport on the request
  // so i can always access this user object from anywhere in my app
  user: req.user,
  cart: cart,
  // add name to checkout.hbs ie.<input type="text" id="address" class="form-control" required name="address">
  // because im using the name field to access it
  // req.body is where express stores the values sent with a post request
  address: req.body.address,
  name: req.body.name,
  // can retrieve the paymentId from my charge object which get passed above to the callback line 78 above
  paymentId: charge.id
});
  order.save(function(err, result) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/checkoutthankyou');
    }
    // If successful flash this message into a success object
    req.flash('success', 'Successfully bought product');
    // Then clear the cart
    req.session.cart = null;
    // Redirect to shop/ index.hbs page (Landing page) if successful
    res.redirect('/');
  });
});
});
// Checkout new  end




module.exports = router;
// This is to protect my routes from unlawful entry
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
