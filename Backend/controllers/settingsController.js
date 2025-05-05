// controllers/settingsController.js
const Setting = require('../models/settingsModel'); // Ensure path is correct
const mongoose = require('mongoose'); // Needed for validation check

// --- Get the current settings (or create default if none exist) ---
exports.getSettings = async (req, res, next) => {
    try {
        let settings = await Setting.findOne({ singleton: 'global_settings' });

        if (!settings) {
            console.log('No settings found, creating default settings document...');
            settings = new Setting(); // Instantiates with defaults from the schema
            await settings.save();
            console.log('Default settings document created successfully.');
        }

        res.status(200).json({ success: true, data: settings });
    } catch (error) {
        console.error("Get Settings Error:", error);
        next(error);
    }
};

// --- Update settings (Admin Only) ---
// This function now expects the *entire* settings structure in req.body
exports.updateSettings = async (req, res, next) => {
    // We expect the full settings object structure in the body
    const { availableDays, timeSlots, serviceAreas, specialDates } = req.body;

    // Basic validation: Check if the main parts exist
    if (availableDays === undefined || timeSlots === undefined || serviceAreas === undefined || specialDates === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Invalid settings data. Missing one or more required fields: availableDays, timeSlots, serviceAreas, specialDates.'
        });
    }

    // Construct the update object containing only the fields we want to update
    const updates = {
        availableDays,
        timeSlots,
        serviceAreas,
        specialDates
    };

    console.log("Attempting to update settings with:", JSON.stringify(updates, null, 2));

    try {
        // Find the single settings document and update it entirely
        // Using findOneAndUpdate with upsert:true ensures it creates if missing (though getSettings should handle this)
        // runValidators: true is crucial for validating the nested arrays/objects against the schema
        const updatedSettings = await Setting.findOneAndUpdate(
            { singleton: 'global_settings' }, // Find the unique document
            { $set: updates },                // Apply the new settings data
            {
                new: true,                 // Return the updated document
                runValidators: true,       // IMPORTANT: Run schema validation on the nested arrays/objects
                upsert: true,              // Create if document doesn't exist
                context: 'query'           // Recommended for runValidators with findOneAndUpdate
            }
        );

        if (!updatedSettings) {
            // This shouldn't happen with upsert:true but handle defensively
            console.error("Failed to find or update settings, even with upsert.");
            return res.status(500).json({ success: false, message: 'Failed to update settings.' });
        }

        console.log("Settings updated successfully.");
        res.status(200).json({
            success: true,
            message: 'Settings updated successfully.',
            data: updatedSettings // Send back the full, validated, updated settings
        });

    } catch (error) {
        console.error("Update Settings Error:", error);

        // Handle Mongoose Validation Errors specifically for better feedback
        if (error instanceof mongoose.Error.ValidationError) {
             console.error("Validation Details:", JSON.stringify(error.errors, null, 2));
             // Extract messages from potentially nested validation errors
             let messages = [];
             for (const path in error.errors) {
                 messages.push(`${path}: ${error.errors[path].message}`);
             }
             const errorMessage = `Validation Failed: ${messages.join('. ')}`;
             return res.status(400).json({ success: false, message: errorMessage });
        }

        // Pass other types of errors to the global handler
        next(error);
    }
};