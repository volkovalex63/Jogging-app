var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UsersSchema = new Schema(
  {
    name: {type: String},
    email: {type: String},
    password: {type: String},
    authority: {type: Number}
  }
);

module.exports = mongoose.model('Users', UsersSchema);
