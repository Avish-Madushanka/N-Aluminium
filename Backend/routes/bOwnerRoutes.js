const express = require('express');
const bOwnerController = require('../controllers/bOwnerController');
const { uploadBusinessPhotos } = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/register', uploadBusinessPhotos, bOwnerController.registerBusinessOwner);

module.exports = router;