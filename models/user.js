//Change this mongoose model to mssql


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// bcrypt will hash my password
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  CustomerCode: {type: String, required: true},
  MobileNumber: {type: String, required: true}

  // email: {type: String, required: true},
  // password: {type: String, required: true}
});

userSchema.methods.encryptPassword = function(MobileNumber) {
  return bcrypt.hashSync(MobileNumber, bcrypt.genSaltSync(5), null);
};
// this.password = current user
userSchema.methods.validPassword =  function(MobileNumber) {
  return bcrypt.compareSync(MobileNumber, this.MobileNumber);
};

module.exports = mongoose.model('User', userSchema);
