// --- START OF UPDATED routes/authRoutes.js ---
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// --- Unified Login Route ---
router.post('/login', authController.unifiedLogin); // Use the new controller function

// --- Keep or remove specific routes as needed ---
// router.post('/client/login', authController.loginClient); // Keep if needed elsewhere, or remove
// router.post('/bowner/login', authController.loginBOwner); // Keep if needed elsewhere, or remove

// --- Logout routes ---
router.post('/client/logout', authController.logoutClient);
router.post('/bowner/logout', authController.logoutBOwner); // Can likely be combined too if desired

module.exports = router;
// --- END OF UPDATED routes/authRoutes.js ---