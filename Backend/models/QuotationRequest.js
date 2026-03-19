const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number
  },
  selectedColor: {
    type: String,
    default: ''
  },
  selectedSize: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  unit: {
    type: String,
    default: 'piece'
  },
  discount: {
    type: Number,
    default: 0
  }
});

const quotationRequestSchema = new mongoose.Schema({
  quotationId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel',
    required: true
  },
  userModel: {
    type: String,
    enum: ['Client', 'BusinessOwner'],
    required: true
  },
  userDetails: {
    name: String,
    email: String,
    phone: String
  },
  items: [quotationItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  }
});

quotationRequestSchema.pre('save', function(next) {
  if (!this.quotationId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.quotationId = `QT-${year}${month}${day}-${random}`;
  }
  next();
});

module.exports = mongoose.model('QuotationRequest', quotationRequestSchema);