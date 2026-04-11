const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  glassType: { type: String, required: true },
  quality: { type: String, required: true },
  size: { type: String, required: true },
  widthFt: { type: Number, required: true },
  heightFt: { type: Number, required: true },
  quantity: { type: Number, required: true },
  areaSqFt: { type: Number, required: true },
  weight: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

const userInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
});

const orderStatusHistorySchema = new mongoose.Schema({
  status: { type: String, enum: ['pending', 'processing', 'dispatched', 'ontheway', 'delivered'], required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String }
});

const glassOrderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  billNumber: { type: String, unique: true },
  items: [orderItemSchema],
  userInfo: userInfoSchema,
  deliveryMethod: { type: String, enum: ['pickup', 'delivery'], required: true },
  totalGlassPrice: { type: Number, required: true },
  transportCost: { type: Number, default: 0 },
  insuranceCost: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  totalWeight: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'bank', 'cash', 'paypal', 'mobile'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paypalTransactionId: { type: String },
  
  pickupDate: { type: String },
  pickupTimeSlot: { type: String },
  
  deliveryAddress: {
    street: String,
    city: String,
    postalCode: String
  },
  selectedLocation: {
    address: String,
    coords: { lat: Number, lng: Number },
    distance: String,
    duration: String
  },
  distance: { type: String },
  deliveryDate: { type: String },
  deliveryTimeSlot: { type: String },
  urgentDelivery: { type: Boolean, default: false },
  insurance: { type: Boolean, default: false },
  
  status: { type: String, enum: ['pending', 'processing', 'dispatched', 'ontheway', 'delivered'], default: 'pending' },
  orderStatusHistory: [orderStatusHistorySchema],
  driverDetails: {
    name: String,
    contact: String,
    vehicleNumber: String
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

glassOrderSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  if (this.isNew && !this.orderId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderId = `ORD-${year}${month}${day}-${random}`;
  }
  
  if (this.isNew && !this.billNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.billNumber = `BILL-${year}${month}${day}-${random}`;
  }
  
  next();
});

module.exports = mongoose.model('GlassOrder', glassOrderSchema);