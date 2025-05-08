// backend/controllers/calendarSettingsController.js
const CalendarSettings = require('../models/CalendarSettings');
const mongoose = require('mongoose');

console.log('[CalendarCtrl] Controller loaded.');

const getOrCreateSettings = async () => {
    const query = { singleton: true };
    console.log('[CalendarCtrl] getOrCreateSettings: Finding with query:', query);
    let settings = await CalendarSettings.findOne(query);
    if (!settings) {
        console.warn('[CalendarCtrl getOrCreateSettings] No settings found, creating default...');
        try {
            settings = new CalendarSettings({ singleton: true });
            await settings.save();
            console.log('[CalendarCtrl getOrCreateSettings] Default settings created.');
        } catch (createError) {
             console.error('[CalendarCtrl getOrCreateSettings] Error creating default:', createError);
             if (createError.code === 11000) { // Handle race condition
                 console.log('[CalendarCtrl getOrCreateSettings] Race condition? Re-fetching...');
                 settings = await CalendarSettings.findOne(query);
                 if (!settings) throw new Error("Failed to retrieve settings after creation attempt.");
             } else { throw createError; }
        }
    } else { console.log('[CalendarCtrl getOrCreateSettings] Found existing settings.'); }
    return settings;
};

exports.getCalendarSettings = async (req, res, next) => {
    console.log('[CalendarCtrl GetSettings] Request received.');
    try {
        const settings = await getOrCreateSettings();
        if (!settings) throw new Error("Could not retrieve/initialize settings.");
        console.log('[CalendarCtrl GetSettings] Sending settings response.');
        res.status(200).json({ success: true, data: settings });
    } catch (error) { console.error('[CalendarCtrl GetSettings] Error:', error); next(error); }
};

exports.updateCalendarSettings = async (req, res, next) => {
    console.log('[CalendarCtrl UpdateSettings] Request received.'); // Don't log full body by default
    try {
        const { availableDays, timeSlots, serviceAreas, specialDates } = req.body;
        if (availableDays === undefined || timeSlots === undefined || serviceAreas === undefined || specialDates === undefined) return res.status(400).json({ success: false, message: 'Missing required settings fields.' });
        if (typeof availableDays !== 'object' || availableDays === null || Array.isArray(availableDays)) return res.status(400).json({ success: false, message: 'availableDays must be an object.' });
        if (!Array.isArray(timeSlots) || !Array.isArray(serviceAreas) || !Array.isArray(specialDates)) return res.status(400).json({ success: false, message: 'timeSlots, serviceAreas, specialDates must be arrays.' });

        const updateData = {
            availableDays: new Map(Object.entries(availableDays || {})),
            timeSlots: (timeSlots || []).map(s => ({ id: s.id || `temp-${Date.now()}`, label: s.label?.trim() || '', time: s.time?.trim() || '', active: !!s.active })),
            serviceAreas: (serviceAreas || []).map(a => ({ id: a.id || `temp-${Date.now()}`, name: a.name?.trim() || '', active: !!a.active })),
            specialDates: (specialDates || []).map(d => ({ id: d.id || `temp-${Date.now()}`, date: d.date || '', status: ['available', 'unavailable'].includes(d.status) ? d.status : 'unavailable', reason: d.reason?.trim() || '' })),
            lastUpdatedAt: new Date()
        };
        console.log('[CalendarCtrl UpdateSettings] Prepared update payload keys:', Object.keys(updateData));

        const updatedSettings = await CalendarSettings.findOneAndUpdate(
            { singleton: true }, { $set: updateData },
            { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
        );
        if (!updatedSettings) throw new Error('Failed to update/upsert settings.');

        console.log('[CalendarCtrl UpdateSettings] Settings updated successfully.');
        res.status(200).json({ success: true, message: 'Calendar settings updated.', data: updatedSettings });
    } catch (error) {
        console.error('[CalendarCtrl UpdateSettings] Error:', error);
        next(error);
    }
};