const express = require('express');
const router = express.Router();
const buyAndSellController = require('../controllers/buyAndSellController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadBuyAndSell } = require('../middleware/buyAndSellUpload');

router.get('/', buyAndSellController.getAllItems);
router.get('/my-items', protect, buyAndSellController.getUserItems);
router.get('/:id', buyAndSellController.getItemById);

router.post(
    '/',
    protect,
    authorize('client', 'businessOwner', 'admin'),
    uploadBuyAndSell,
    buyAndSellController.createItem
);

router.put(
    '/:id',
    protect,
    authorize('client', 'businessOwner', 'admin'),
    uploadBuyAndSell,
    buyAndSellController.updateItem
);

router.put('/:id/status', protect, buyAndSellController.updateItemStatus);
router.delete('/:id', protect, buyAndSellController.deleteItem);

module.exports = router;