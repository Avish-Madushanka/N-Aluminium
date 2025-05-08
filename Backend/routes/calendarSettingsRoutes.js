// backend/routes/calendarSettingsRoutes.js
const express = require('express');
const calendarSettingsController = require('../controllers/calendarSettingsController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

console.log('[Routes/Calendar] Loaded.');
const log = (req, res, next) => { console.log(`[Routes/Calendar] Hit: ${req.method} ${req.originalUrl}`); next(); };

// ALL routes require ADMIN privileges
router.use(log, authMiddleware.protect, authMiddleware.authorize('admin')); // Apply middleware to all routes below

// GET /api/calendar-settings/
router.get('/', calendarSettingsController.getCalendarSettings);

// PUT /api/calendar-settings/
router.put('/', calendarSettingsController.updateCalendarSettings);

module.exports = router;