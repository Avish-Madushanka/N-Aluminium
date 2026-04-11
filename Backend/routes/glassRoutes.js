const express = require('express');
const router = express.Router();
const glassProductController = require('../controllers/glassProductController');
const glassOrderController = require('../controllers/glassOrderController');
const paypalController = require('../controllers/paypalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/products', glassProductController.getGlassProducts);
router.put('/products', protect, authorize('admin'), glassProductController.updateGlassProducts);
router.post('/products/reset', protect, authorize('admin'), glassProductController.resetGlassProducts);

router.post('/orders', glassOrderController.createOrder);
router.get('/orders', protect, authorize('admin'), glassOrderController.getOrders);
router.get('/orders/stats', protect, authorize('admin'), glassOrderController.getOrderStats);
router.get('/orders/:id', glassOrderController.getOrderById);
router.get('/orders/user/:email', glassOrderController.getUserOrders);
router.put('/orders/:id/status', protect, authorize('admin'), glassOrderController.updateOrderStatus);

router.post('/paypal/create-order', paypalController.createPayPalOrder);
router.post('/paypal/capture-order', paypalController.capturePayPalOrder);

module.exports = router;