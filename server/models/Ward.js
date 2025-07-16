// server/models/Ward.js

const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  municipality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Municipality',
    required: true
  }
});

module.exports = mongoose.model('Ward', wardSchema);