const express = require('express');
const calendarSettingsController = require('../controllers/calendarSettingsController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

const log = (req, res, next) => { /* console.log(`[Routes/Calendar] Hit: ${req.method} ${req.originalUrl}`); */ next(); };

router.get('/', log, calendarSettingsController.getCalendarSettings);

router.put('/', log, authMiddleware.protect, authMiddleware.authorize('admin'), calendarSettingsController.updateCalendarSettings);

module.exports = router;