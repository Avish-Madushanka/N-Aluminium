// models/settingsModel.js
const mongoose = require('mongoose');

// Schema for individual time slots
const timeSlotSchema = new mongoose.Schema({
    id: { type: String, required: true }, // e.g., "morning", "midday"
    time: { type: String, required: true }, // e.g., "8:00 AM - 11:00 AM"
    label: { type: String, required: true }, // e.g., "Morning"
    active: { type: Boolean, default: true }
}, { _id: false });

// Schema for individual service areas
const serviceAreaSchema = new mongoose.Schema({
    id: { type: String, required: true }, // e.g., "downtown", "north"
    name: { type: String, required: true }, // e.g., "Downtown Core"
    active: { type: Boolean, default: true }
}, { _id: false });

// Schema for special dates (overrides regular availability)
const specialDateSchema = new mongoose.Schema({
    date: { type: String, required: true, match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'] }, // Format: YYYY-MM-DD
    status: { type: String, enum: ['available', 'unavailable'], required: true },
    reason: { type: String, trim: true } // Optional reason (e.g., "Holiday", "Maintenance")
}, { _id: false });

// Main settings schema - designed to have only one document
const settingsSchema = new mongoose.Schema({
    // Using a fixed key ensures only one settings document exists
    singleton: {
        type: String,
        default: 'global_settings',
        unique: true,
        required: true,
        immutable: true // Prevents changing this key after creation
    },
    availableDays: {
        // Day index (0=Sun, 1=Mon, ...) mapped to boolean (true=available)
        type: Map,
        of: Boolean,
        required: true,
        default: {
            '0': false, // Sunday
            '1': true,  // Monday
            '2': false, // Tuesday
            '3': true,  // Wednesday
            '4': false, // Thursday
            '5': true,  // Friday
            '6': false  // Saturday
        }
    },
    timeSlots: {
        type: [timeSlotSchema],
        required: true,
        default: [
            { id: "morning", time: "8:00 AM - 11:00 AM", label: "Morning", active: true },
            { id: "midday", time: "11:00 AM - 2:00 PM", label: "Midday", active: true },
            { id: "afternoon", time: "2:00 PM - 5:00 PM", label: "Afternoon", active: true },
            { id: "evening", time: "5:00 PM - 7:00 PM", label: "Evening", active: false }
        ]
    },
    serviceAreas: {
        type: [serviceAreaSchema],
        required: true,
        default: [
            { id: "downtown", name: "Downtown Core", active: true },
            { id: "north", name: "North Side", active: true },
            { id: "south", name: "South Side", active: false },
            { id: "east", name: "East End", active: true },
            { id: "west", name: "West End", active: true }
        ]
    },
    specialDates: {
        type: [specialDateSchema],
        default: []
    }
}, { timestamps: true }); // Adds createdAt and updatedAt

// Use singular 'Setting' for the model name as convention
const Setting = mongoose.model('Setting', settingsSchema);
module.exports = Setting;