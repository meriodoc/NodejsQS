var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping2');

var products = [
  new Product({
    imagePath: 'images/ProdImages/Cleaning-Hamper.png',
    title: 'Cleaning Hamper',
    description: 'Cleaning Hamper consists of ...',
    price: 450
  }),
  new Product({
    imagePath: 'images/ProdImages/Hamper-B.png',
    title: 'Hamper B',
    description: 'Hamper B consists of ...',
    price: 694
  }),
  new Product({
    imagePath: 'images/ProdImages/Hamper-D.png',
    title: 'Hamper D',
    description: 'Hamper D consists of ...',
    price: 375
  }),
];


var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
