//Change this mongoose model to mssql

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Here I define the db schema
var schema = new Schema({
  imagePath: {type: String, required: true},
  title: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true}
});

module.exports = mongoose.model('Product', schema);
