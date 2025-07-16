// server/models/Municipality.js

const mongoose = require('mongoose');

const municipalitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Province',
    required: true
  }
});

module.exports = mongoose.model('Municipality', municipalitySchema);