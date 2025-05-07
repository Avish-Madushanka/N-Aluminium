const express = require('express');
const clientController = require('../controllers/clientController');
const { uploadProfilePhoto } = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/register', uploadProfilePhoto, clientController.registerClient);

module.exports = router;