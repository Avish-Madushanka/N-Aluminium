const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadItemImage } = require('../middleware/uploadMiddleware');

router.get('/', itemController.getAllItems);
router.get('/featured', itemController.getFeaturedItems);
router.get('/category/:category', itemController.getItemsByCategory);
router.get('/:id', itemController.getItemById);

router.post(
    '/',
    protect,
    authorize('admin', 'client', 'businessOwner'),
    uploadItemImage,
    itemController.createItem
);

router.put(
    '/:id',
    protect,
    authorize('admin', 'client', 'businessOwner'),
    uploadItemImage,
    itemController.updateItem
);

router.delete(
    '/:id',
    protect,
    authorize('admin', 'client', 'businessOwner'),
    itemController.deleteItem
);

console.log(' Item routes loaded');

module.exports = router;