const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  // schema definition
});

module.exports = mongoose.model('Data', DataSchema);