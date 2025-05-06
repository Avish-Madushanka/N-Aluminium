// models/Client.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const config = require('../config/config'); // For JWT_SECRET and JWT_EXPIRE

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  contactNumber: {
    type: String,
    required: [true, 'Please add a contact number'],
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number'], // Example: 10 digit Sri Lankan number
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Do not return password by default
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
    minlength: [10, 'Address should be at least 10 characters'],
  },
  district: {
    type: String,
    required: [true, 'Please select a district'],
    // Example enum, adjust as needed
    enum: ['colombo', 'kandy', 'galle', 'matara', 'jaffna', 'batticaloa', 'anuradhapura', 'other'],
    default: 'colombo',
  },
  province: {
    type: String,
    required: [true, 'Please select a province'],
    // Example enum, adjust as needed
    enum: ['western', 'central', 'southern', 'northern', 'eastern', 'north-western', 'north-central', 'uva', 'sabaragamuwa', 'other'],
    default: 'western',
  },
  profilePhoto: {
    type: String,
    default: 'default.jpg', // A default image name in your uploads/profiles folder
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password before saving
clientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
clientSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    return false; // Or throw error if you want to handle it differently
  }
};

// Sign JWT and return
clientSchema.methods.getSignedJwtToken = function() {
  if (!config.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    // In a real app, you might throw an error or handle this more gracefully,
    // but for now, exiting helps identify the missing config during development.
    // Consider a less drastic approach for production.
    throw new Error('JWT_SECRET not configured, cannot sign token.');
  }
  return jwt.sign({ id: this._id, role: this.role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE || '30d',
  });
};

module.exports = mongoose.model('Client', clientSchema);