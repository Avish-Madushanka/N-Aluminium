// backend/routes/calendarSettingsRoutes.js
const express = require('express');
const calendarSettingsController = require('../controllers/calendarSettingsController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const log = (req, res, next) => { /* console.log(`[Routes/Calendar] Hit: ${req.method} ${req.originalUrl}`); */ next(); };

// GET /api/calendar-settings/ (Publicly accessible)
// REMOVED authMiddleware.protect from this line
router.get('/', log, calendarSettingsController.getCalendarSettings);

// PUT /api/calendar-settings/ (Admin only - This should remain protected)
router.put('/', log, authMiddleware.protect, authMiddleware.authorize('admin'), calendarSettingsController.updateCalendarSettings);

module.exports = router;