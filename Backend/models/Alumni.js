const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  idNumber: { type: String, required: true, unique: true, trim: true },
  address: { type: String, required: true, trim: true },
  birthday: { type: Date, required: true },
  gender: { type: String, required: true, enum: ['male', 'female'] },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  idPhoto: { type: String, required: true },
  cvFile: { type: String },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

alumniSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

let Alumni;
try {
  Alumni = mongoose.model('Alumni');
} catch (error) {
  Alumni = mongoose.model('Alumni', alumniSchema);
}

module.exports = Alumni;