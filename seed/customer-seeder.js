var Customer = require('../models/customer');

var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping2');

var customers = [
  new Customer({
    CustomerCode: '1',
    CustomerName: 'JohnnyOne',
    FirstName: 'Johnny',
    LastName: 'One',
    MobileNumber: '1111111111',
    HouseNumber: '1',
    Street: 'First Street',
    Area: 'First Area',
    Site: 'First Site',
    Town: 'First Town'
  }),
  new Customer({
    CustomerCode: '2',
    CustomerName: 'JaneTwo',
    FirstName: 'Jane',
    LastName: 'Two',
    MobileNumber: '2222222222',
    HouseNumber: '2',
    Street: 'Second Street',
    Area: 'Second Area',
    Site: 'Second Site',
    Town: 'Second Town'
  }),
  new Customer({
    CustomerCode: '3',
    CustomerName: 'JimThree',
    FirstName: 'Jim',
    LastName: 'Three',
    MobileNumber: '3333333333',
    HouseNumber: '3',
    Street: 'Third Street',
    Area: 'Third Area',
    Site: 'Third Site',
    Town: 'Third Town'
  }),
];


var done = 0;
for (var i = 0; i < customers.length; i++) {
  customers[i].save(function(err, result) {
    done++;
    if (done === customers.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
