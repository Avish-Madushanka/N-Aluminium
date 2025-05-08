// backend/models/CalendarSettings.js
const mongoose = require('mongoose');

console.log('[CalendarSettingsModel] File loaded. Defining schemas...');

// --- Subdocument Schemas (Keep as before) ---
const timeSlotSchema = new mongoose.Schema({ /* ... */ id: String, label: String, time: String, active: Boolean }, { _id: false });
const serviceAreaSchema = new mongoose.Schema({ /* ... */ id: String, name: String, active: Boolean }, { _id: false });
const specialDateSchema = new mongoose.Schema({ /* ... */ id: String, date: String, status: String, reason: String }, { _id: false });

console.log('[CalendarSettingsModel] Subdocument schemas defined.');

// --- Main Schema ---
const calendarSettingsSchema = new mongoose.Schema({
    singleton: {
        type: Boolean,
        default: true,
        unique: true, // <-- This enforces the rule at the DB level
        required: true
        // *** REMOVED Custom Validator ***
    },
    availableDays: {
        type: Map,
        of: Boolean,
        required: true,
        default: () => new Map([['0', false], ['1', true], ['2', false], ['3', true], ['4', false], ['5', true], ['6', false]])
    },
    timeSlots: {
        type: [timeSlotSchema],
        default: () => [ /* ... default slots ... */
            { id: "ts-default-morning", label: "Morning", time: "8:00 AM - 12:00 PM", active: true },
            { id: "ts-default-afternoon", label: "Afternoon", time: "1:00 PM - 5:00 PM", active: true }
        ]
    },
    serviceAreas: {
        type: [serviceAreaSchema],
        default: () => [ /* ... default areas ... */
            { id: "sa-default-zone1", name: "Default Zone 1", active: true }
        ]
    },
    specialDates: {
        type: [specialDateSchema],
        default: []
    },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'lastUpdatedAt' } // Use built-in timestamps
});

console.log('[CalendarSettingsModel] Main schema defined.');

// No pre-save hook needed if using timestamps option

// --- Export Logic (Robust check) ---
let CalendarSettings;
const modelName = 'CalendarSettings';
try {
    CalendarSettings = mongoose.model(modelName);
    console.log(`[CalendarSettingsModel] Model '${modelName}' reused.`);
} catch (error) {
    CalendarSettings = mongoose.model(modelName, calendarSettingsSchema);
    console.log(`[CalendarSettingsModel] Model '${modelName}' compiled.`);
}
console.log(`[CalendarSettingsModel] Exporting. Type: ${typeof CalendarSettings}, Has findOne: ${typeof CalendarSettings?.findOne === 'function'}`);
module.exports = CalendarSettings;