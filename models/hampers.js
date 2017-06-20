//Change this mongoose model to mssql
var sql = require('mssql');
var Schema = mssql.Schema;
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// Here I define the db schema
var schema = new Schema({
ProductID = {type: BIGINT, IDENTITY: (1,1) NOT NULL},
ProductCode = {type: nvarchar(100), NOT NULL},
DisplayDescrip = {type: nvarchar(100), NULL},
ProductDescrip = {type: nvarchar(2000), NOT NULL},
ImagePath = {type: nvarchar(100), NULL},
SellingPrice = {type: MONEY, NULL},
isSpecial = {????????}
)};
module.exports = mssql.model('Hampers', schema);
// var schema = new Schema({
//   imagePath: {type: String, required: true},
//   title: {type: String, required: true},
//   description: {type: String, required: true},
//   price: {type: Number, required: true}
// });
//
// module.exports = mongoose.model('Product', schema);
