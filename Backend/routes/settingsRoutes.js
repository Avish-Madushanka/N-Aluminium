const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController'); // Ensure path is correct
const { protectAdmin } = require('../middleware/adminMiddleware'); // Import admin protection middleware

// GET /api/settings - Get current calendar settings (Public)
// The frontend needs this to initialize the calendar/settings admin UI
router.get('/', settingsController.getSettings);

// PUT /api/settings - Update *all* calendar settings (Requires Admin Auth)
// Frontend should send the complete, updated settings object in the request body
router.put('/', protectAdmin, settingsController.updateSettings); // Apply middleware here

module.exports = router;