const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  selectedColor: {
    type: String,
    default: ''
  },
  selectedSize: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  unit: {
    type: String
  },
  discount: {
    type: Number,
    default: 0
  },
  colors: [{
    type: String
  }],
  sizes: [{
    type: String
  }]
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel',
    required: true,
    unique: true
  },
  userModel: {
    type: String,
    enum: ['Client', 'BusinessOwner', 'Admin'],
    default: 'Client'
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

cartSchema.methods.calculateTotal = function() {
  this.totalAmount = this.items.reduce((total, item) => {
    const price = item.discountedPrice || item.price;
    return total + (price * item.quantity);
  }, 0);
  return this.totalAmount;
};

cartSchema.pre('save', function(next) {
  this.calculateTotal();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);