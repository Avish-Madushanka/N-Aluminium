// routes/clientRoutes.js
const express = require('express');
const { registerClient, getMe } = require('../controllers/clientController');
const upload = require('../utils/upload'); // For handling file uploads
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public route for registration, uses multer middleware for 'profilePhoto' field
router.post('/register', upload.single('profilePhoto'), registerClient);

// Private route to get current client's profile
router.get('/me', protect, getMe);

module.exports = router;