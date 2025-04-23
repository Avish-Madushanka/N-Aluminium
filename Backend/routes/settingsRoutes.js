// routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
// Optional: Import admin middleware if updates are restricted
// const { protectAdmin } = require('../middleware/adminMiddleware');

// GET /api/settings - Get current calendar settings (Public)
// The frontend needs this to initialize the calendar
router.get('/', settingsController.getSettings);

// PUT /api/settings - Update calendar settings (Requires Admin Auth)
// Ensure only admins can modify settings
// router.put('/', protectAdmin, settingsController.updateSettings);

module.exports = router;