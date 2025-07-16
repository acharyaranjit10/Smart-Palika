// server/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  phone: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  province: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },

  municipality: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },

  ward: {
    number: {
      type: Number,
      required: true
    }
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  adminLevel: {
    type: String,
    enum: ['ward', 'municipality', 'province'],
    default: null
  },

  registeredAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare entered password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);