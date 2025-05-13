const express = require('express');
const router = express.Router();
const { registerCollector } = require('../controllers/collectorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerCollector);

module.exports = router;