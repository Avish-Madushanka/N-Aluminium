// backend/models/CalendarSettings.js
const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({ 
    id: {type: String, required: true }, 
    label: {type: String, required: true }, 
    time: {type: String, required: true }, 
    active: {type: Boolean, default: true }
}, { _id: false });

const serviceAreaSchema = new mongoose.Schema({ 
    id: {type: String, required: true }, 
    name: {type: String, required: true }, 
    active: {type: Boolean, default: true }
}, { _id: false });

const specialDateSchema = new mongoose.Schema({ 
    id: {type: String, required: true }, 
    date: {type: String, required: true }, 
    status: {type: String, enum: ['available', 'unavailable'], required: true }, 
    reason: {type: String }
}, { _id: false });

const calendarSettingsSchema = new mongoose.Schema({
    singleton: { type: Boolean, default: true, unique: true, required: true },
    availableDays: {
        type: Map,
        of: Boolean,
        required: true,
        default: () => new Map([['0', false], ['1', true], ['2', false], ['3', true], ['4', false], ['5', true], ['6', false]])
    },
    timeSlots: {
        type: [timeSlotSchema],
        default: () => [
            { id: "ts-default-morning", label: "Morning", time: "8:00 AM - 12:00 PM", active: true },
            { id: "ts-default-afternoon", label: "Afternoon", time: "1:00 PM - 5:00 PM", active: true }
        ]
    },
    serviceAreas: {
        type: [serviceAreaSchema],
        default: () => [
            { id: "sa-default-zone1", name: "Default Zone 1", active: true }
        ]
    },
    specialDates: { type: [specialDateSchema], default: [] },
    dateSettings: { 
        type: Map,
        of: new mongoose.Schema({
            timeSlots: [String],    
            serviceAreas: [String]  
        }, { _id: false }),
        default: () => new Map()
    },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'lastUpdatedAt' }
});

let CalendarSettings;
try {
    CalendarSettings = mongoose.model('CalendarSettings');
} catch (error) {
    CalendarSettings = mongoose.model('CalendarSettings', calendarSettingsSchema);
}
module.exports = CalendarSettings;