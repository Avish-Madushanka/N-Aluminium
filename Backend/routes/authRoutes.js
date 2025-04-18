const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.unifiedLogin);
router.post('/client/logout', authController.logoutClient);
router.post('/bowner/logout', authController.logoutBOwner);

module.exports = router;