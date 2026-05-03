const mongoose = require('mongoose');

const serviceAreaSchema = new mongoose.Schema({
  city: { type: String, required: true },
  zipCode: { type: String },
  pickupFee: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('ServiceArea', serviceAreaSchema);