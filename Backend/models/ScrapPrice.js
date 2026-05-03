const mongoose = require('mongoose');

const scrapPriceSchema = new mongoose.Schema({
  material: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'USD/kg' },
  grade: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScrapPrice', scrapPriceSchema);