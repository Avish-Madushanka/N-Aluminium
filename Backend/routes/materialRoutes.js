// routes/materialRoutes.js
const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
// Optional: Import admin middleware for management routes
// const { protectAdmin } = require('../middleware/adminMiddleware');

// GET /api/materials - Get active material types (Public)
// Used by the frontend booking form
router.get('/', materialController.getActiveMaterials);

module.exports = router;