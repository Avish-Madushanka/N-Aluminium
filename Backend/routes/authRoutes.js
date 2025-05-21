const express = require('express');
const authController = require('../controllers/authController'); 
const router = express.Router();

console.log('[Routes/Auth] Loaded. (Original Version - attempting to use authController)');

if (authController && typeof authController.login === 'function') {
    router.post('/login', authController.login);
    console.log('[Routes/Auth] /login route configured with authController.login.');
} else {
    console.error('[Routes/Auth] CRITICAL ERROR: authController.login is not a function or authController is undefined. /login route NOT configured.');
    router.post('/login', (req, res) => {
        res.status(500).json({ success: false, message: 'Server Error: Auth controller failed to load.' });
    });
}

module.exports = router;