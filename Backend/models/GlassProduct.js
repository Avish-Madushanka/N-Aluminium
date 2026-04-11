const mongoose = require('mongoose');

const glassProductSchema = new mongoose.Schema({
  name: { type: String, default: "ALUX Glass Products" },
  glassTypes: {
    type: Map,
    of: new mongoose.Schema({
      Standard: { type: Map, of: Number },
      Premium: { type: Map, of: Number }
    })
  },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('GlassProduct', glassProductSchema);