const express = require('express');
const {
    getUserDistribution,
    getBookingSummary,
    getSalesOverview
} = require('../controllers/adminStatsController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/user-distribution', getUserDistribution);
router.get('/booking-summary', getBookingSummary);
router.get('/sales-overview', getSalesOverview);

module.exports = router;