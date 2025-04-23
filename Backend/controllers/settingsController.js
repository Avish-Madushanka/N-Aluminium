// controllers/settingsController.js
const Setting = require('../models/settingsModel');

// --- Get the current settings (or create default if none exist) ---
exports.getSettings = async (req, res, next) => {
    try {
        let settings = await Setting.findOne({ singleton: 'global_settings' });

        if (!settings) {
            // If no settings document exists in the DB, create the default one.
            console.log('No settings found in database, creating default settings document...');
            settings = new Setting(); // Instantiates with defaults from the schema
            await settings.save(); // <<< MUST AWAIT
            console.log('Default settings document created successfully.');
        }

        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error("Get Settings Error:", error);
        next(error); // Pass error to the global handler
    }
};

// --- Update settings (Admin Only) ---
// Add protectAdmin middleware in the corresponding route definition
exports.updateSettings = async (req, res, next) => {
    // Only allow updating specific fields to prevent accidental modification of 'singleton'
    const allowedUpdates = ['availableDays', 'timeSlots', 'serviceAreas', 'specialDates'];
    const updates = {};

    // Filter req.body to only include allowed fields
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid settings data provided for update.' });
    }

    console.log("Attempting to update settings with:", JSON.stringify(updates, null, 2));

    try {
        // Find the single settings document and update it
        // Using findOneAndUpdate with upsert:true ensures it creates if missing (though getSettings should handle creation)
        const updatedSettings = await Setting.findOneAndUpdate(
            { singleton: 'global_settings' }, // Find the unique document
            { $set: updates }, // Apply the filtered updates
            { new: true, runValidators: true, upsert: true } // Options: return updated doc, run schema validators, create if not found
        );

        if (!updatedSettings) {
             // This should theoretically not happen with upsert:true, but handle defensively
            console.error("Failed to find or update settings, even with upsert.");
            return res.status(500).json({ success: false, message: 'Failed to update settings.' });
        }


        console.log("Settings updated successfully.");
        res.status(200).json({ success: true, message: 'Settings updated successfully.', data: updatedSettings });

    } catch (error) {
        console.error("Update Settings Error:", error);
         if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: `Validation Failed: ${messages.join('. ')}` });
        }
        next(error); // Pass other errors to the global handler
    }
};