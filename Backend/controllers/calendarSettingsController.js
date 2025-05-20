const CalendarSettings = require('../models/CalendarSettings');

const getOrCreateSettings = async () => {
    let settings = await CalendarSettings.findOne({ singleton: true });
    if (!settings) {
        console.warn('[CalendarCtrl getOrCreateSettings] No settings found, creating default...');
        try {
            settings = new CalendarSettings({ singleton: true }); 
            await settings.save();
            console.log('[CalendarCtrl getOrCreateSettings] Default settings created.');
        } catch (createError) { 
            console.error('[CalendarCtrl getOrCreateSettings] Error creating default:', createError);
            if (createError.code === 11000) { 
                console.log('[CalendarCtrl getOrCreateSettings] Race condition? Re-fetching...');
                settings = await CalendarSettings.findOne({ singleton: true });
                if (!settings) throw new Error("Failed to retrieve settings after creation attempt.");
            } else { throw createError; }
        }
    }
    return settings;
};

exports.getCalendarSettings = async (req, res, next) => {
    console.log('[CalendarCtrl GetSettings] Request received.');
    try {
        const settings = await getOrCreateSettings();
        if (!settings) throw new Error("Could not retrieve/initialize settings.");
        res.status(200).json({ success: true, data: settings });
    } catch (error) { console.error('[CalendarCtrl GetSettings] Error:', error); next(error); }
};

exports.updateCalendarSettings = async (req, res, next) => {
    console.log('[CalendarCtrl UpdateSettings] Request received.');
    try {
        const { availableDays, timeSlots, serviceAreas, specialDates, dateSettings } = req.body;

        if (availableDays === undefined || timeSlots === undefined || serviceAreas === undefined || specialDates === undefined || dateSettings === undefined) {
            return res.status(400).json({ success: false, message: 'Missing required settings fields.' });
        }
        if (typeof availableDays !== 'object' || availableDays === null || Array.isArray(availableDays)) return res.status(400).json({ success: false, message: 'availableDays must be an object.' });
        if (!Array.isArray(timeSlots) || !Array.isArray(serviceAreas) || !Array.isArray(specialDates)) return res.status(400).json({ success: false, message: 'timeSlots, serviceAreas, specialDates must be arrays.' });
        if (typeof dateSettings !== 'object' || dateSettings === null || Array.isArray(dateSettings)) return res.status(400).json({ success: false, message: 'dateSettings must be an object.' });

        const updateData = {
            availableDays: new Map(Object.entries(availableDays || {})),
            timeSlots: (timeSlots || []).map(s => ({ id: s.id || `ts-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, label: s.label?.trim() || '', time: s.time?.trim() || '', active: !!s.active })),
            serviceAreas: (serviceAreas || []).map(a => ({ id: a.id || `sa-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, name: a.name?.trim() || '', active: !!a.active })),
            specialDates: (specialDates || []).map(d => ({ id: d.id || `sd-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`, date: d.date || '', status: ['available', 'unavailable'].includes(d.status) ? d.status : 'unavailable', reason: d.reason?.trim() || '' })),
            dateSettings: new Map(Object.entries(dateSettings || {})), 
            lastUpdatedAt: new Date()
        };

        const updatedSettings = await CalendarSettings.findOneAndUpdate(
            { singleton: true },
            { $set: updateData },
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