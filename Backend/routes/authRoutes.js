// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Ensure this path is correct

// POST /api/auth/login
router.post('/login', authController.unifiedLogin);

// POST /api/auth/client/logout
router.post('/client/logout', authController.logoutClient);

// POST /api/auth/bowner/logout
router.post('/bowner/logout', authController.logoutBOwner);

module.exports = router;