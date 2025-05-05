const mongoose = require('mongoose');

let nanoid;
(async () => {
  const nanoidModule = await import('nanoid');
  nanoid = nanoidModule.nanoid;
})();

// Temporary fallback if nanoid is not yet ready (rare case during startup)
const generateBookingId = () => {
  const fallbackId = `ALU-${new Date().toISOString().slice(5, 10).replace('-', '')}-xxxxx`;
  return nanoid ? `ALU-${new Date().toISOString().slice(5, 10).replace('-', '')}-${nanoid(5)}` : fallbackId;
};

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Contact phone number is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    default: generateBookingId
  },
  selectedDate: {
    type: Date,
    required: [true, 'Pickup date is required']
  },
  timeSlotId: {
    type: String,
    required: [true, 'Time slot selection is required']
  },
  serviceAreaId: {
    type: String,
    required: [true, 'Service area selection is required']
  },
  materialTypeId: {
    type: String,
    required: [true, 'Material type selection is required']
  },
  estimatedWeight: {
    type: Number,
    min: [0, 'Estimated weight cannot be negative']
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location address is required'],
    trim: true
  },
  contactDetails: {
    type: contactSchema,
    required: [true, 'Contact details are required']
  },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'completed', 'cancelled'],
    default: 'confirmed'
  }
}, { timestamps: true });

bookingSchema.index({ selectedDate: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
