// backend/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
console.log('[Routes/Auth] Loaded.');
router.post('/login', authController.login);
module.exports = router;