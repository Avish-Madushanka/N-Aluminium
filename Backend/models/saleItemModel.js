const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Item name is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'], trim: true },
  address: { type: String, required: [true, 'Address is required'], trim: true },
  district: { type: String, required: [true, 'District is required'], trim: true },
  province: { type: String, required: [true, 'Province is required'], trim: true },
  price: { type: Number, required: [true, 'Price is required'] },
  contact: { type: String, required: [true, 'Contact number is required'], trim: true },
  image: { type: String, required: [true, 'Image is required'] },
  type: { type: String, required: [true, 'Item type is required'], enum: ['Doors', 'Windows', 'Pan-Light', 'Others'] },
}, { timestamps: true });

const SaleItem = mongoose.model('SaleItem', saleItemSchema);
module.exports = SaleItem;