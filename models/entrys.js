var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EntrySchema = new Schema(
  {
    userid: {type: Schema.ObjectId, ref: 'Users', required: true},
    inputdate: {type: Date},
    distance: {type: Number},
    time: {type: Number},
    week: {type: String}
  }
);

module.exports = mongoose.model('Entrys', EntrySchema);
