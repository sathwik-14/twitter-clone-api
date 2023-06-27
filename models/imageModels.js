const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
email:String,
  filename: String,
  size: Number,
  contentType: String,
  data: Buffer,
});

module.exports = mongoose.model('File', FileSchema);
