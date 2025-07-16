const mongoose = require('mongoose');

const statusEnum = ['Submitted', 'Reviewed', 'In Progress', 'Resolved'];

const complaintSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',            // References the user who filed the complaint
    required: true
  },

  title: {
    type: String,           // Complaint headline
    required: true,
    trim: true
  },

  description: {
    type: String,           // Full complaint details
    required: true
  },

  date: {
    type: Date,             // Timestamp of submission
    default: Date.now
  },

  province: {
    type: String,           // Location details
    required: true
  },

  municipality: {
    type: String,
    required: true
  },

  ward: {
    type: String,           // e.g. "Ward 5"
    required: true
  },

  wardNo: {
    type: Number,           // e.g. 5
    required: true
  },

  location: {
    lat: { type: Number },  // Latitude
    lng: { type: Number }   // Longitude
    // You can add `required: true` if geolocation is mandatory
  },

  imageUrl: {
    type: String,           // Hosted URL from Cloudinary
    required: false
  },

  status: {
    type: String,           // Current status
    enum: statusEnum,
    default: 'Submitted'
  },

  statusHistory: [
    {
      status: {
        type: String,
        enum: statusEnum
      },
      date: {
        type: Date
      }
    }
  ]
});

module.exports = mongoose.model('Complaint', complaintSchema);