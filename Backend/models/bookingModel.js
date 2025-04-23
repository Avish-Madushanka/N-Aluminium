// models/bookingModel.js
const mongoose = require('mongoose');
const { nanoid } = require('nanoid'); // Optional: for better booking IDs

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
}, { _id: false }); // Prevent _id generation for subdocument

const bookingSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        required: true,
        unique: true,
        // Generate a default ID. Using nanoid is generally better than Math.random.
        default: () => `ALU-${new Date().toISOString().slice(5, 10).replace('-', '')}-${nanoid(5)}`
    },
    selectedDate: {
        type: Date,
        required: [true, 'Pickup date is required']
    },
    timeSlotId: { // Matches the 'id' field in Settings.timeSlots
        type: String,
        required: [true, 'Time slot selection is required']
    },
    serviceAreaId: { // Matches the 'id' field in Settings.serviceAreas
        type: String,
        required: [true, 'Service area selection is required']
    },
    materialTypeId: { // Matches the 'id' field in Material model
        type: String,
        required: [true, 'Material type selection is required']
    },
    estimatedWeight: { // Stored in kg
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
        default: 'confirmed' // Defaulting to confirmed as per frontend flow
    },
    // Optional: Link to the user who booked it, if users must be logged in
    // clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    // bOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessOwner' },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Optional: Indexes for faster queries if needed
bookingSchema.index({ selectedDate: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;