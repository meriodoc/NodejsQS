var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  CustomerCode: {type: String, required: true},
  CustomerName: {type: String, required: true},
  FirstName: {type: String, required: true},
  LastName: {type: String, required: true},
  MobileNumber: {type: String, required: true},
  HouseNumber: {type: String, required: true},
  Street: {type: String, required: true},
  Area: {type: String, required: true},
  Site: {type: String, required: true},
  Town: {type: String, required: true}
});

module.exports = mongoose.model('Customer', schema);
