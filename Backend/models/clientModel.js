const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] },
  contactNumber: { type: String, required: [true, 'Contact number is required'], trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters long'], select: false },
  address: { type: String, required: [true, 'Address is required'], trim: true },
  district: { type: String, required: [true, 'District is required'], trim: true },
  province: { type: String, required: [true, 'Province is required'], trim: true },
  profilePhoto: { type: String, default: '' },
  role: { type: String, enum: ['client'], default: 'client' }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;