const mongoose = require('mongoose');

// define schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  tc: {
    type: Boolean,
    default: false,
    required: true,
  },
});

// create model
const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
