var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
  pageName: String,
  pageDescription: String,
  pageAdmin: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  pageEditor: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  pageModerator: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]

});
module.exports = mongoose.model('Page',pageSchema);
