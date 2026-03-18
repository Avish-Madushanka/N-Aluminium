const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const { protect } = require('../middleware/authMiddleware');

router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Cart API test route is working!',
    timestamp: new Date().toISOString()
  });
});

router.get('/', protect, async (req, res) => {
  try {
    console.log(`[Cart API] Getting cart for user: ${req.user._id}`);
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      console.log(`[Cart API] No cart found for user ${req.user._id}, creating new cart`);
      cart = new Cart({
        userId: req.user._id,
        userModel: req.user.role === 'admin' ? 'Admin' : 
                  req.user.role === 'businessOwner' ? 'BusinessOwner' : 'Client',
        items: [],
        totalAmount: 0
      });
      await cart.save();
    }
    
    console.log(`[Cart API] Found cart with ${cart.items.length} items`);
    
    res.json({
      success: true,
      data: cart.items
    });
  } catch (error) {
    console.error('[Cart API] Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart: ' + error.message
    });
  }
});


router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, selectedColor = '', selectedSize = '' } = req.body;
    
    console.log(`[Cart API] Adding item to cart for user: ${req.user._id}`);
    console.log(`[Cart API] Product ID: ${productId}, Quantity: ${quantity}`);
    
    const product = await Item.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        userModel: req.user.role === 'admin' ? 'Admin' : 
                  req.user.role === 'businessOwner' ? 'BusinessOwner' : 'Client',
        items: []
      });
    }
    
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId &&
      item.selectedColor === selectedColor &&
      item.selectedSize === selectedSize
    );
    
    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        selectedColor,
        selectedSize,
        price: product.price,
        discountedPrice: product.discountedPrice || product.price,
        name: product.name,
        image: product.image,
        unit: product.unit,
        discount: product.discount || 0,
        colors: product.colors || [],
        sizes: product.sizes || []
      });
    }
    
    await cart.save();
    
    res.json({
      success: true,
      data: cart.items,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('[Cart API] Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart: ' + error.message
    });
  }
});

router.put('/:itemId', protect, async (req, res) => {
  try {
    const { quantity, selectedColor, selectedSize } = req.body;
    const { itemId } = req.params;
    
    console.log(`[Cart API] Updating item ${itemId} for user: ${req.user._id}`);
    
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    if (quantity !== undefined) cart.items[itemIndex].quantity = quantity;
    if (selectedColor !== undefined) cart.items[itemIndex].selectedColor = selectedColor;
    if (selectedSize !== undefined) cart.items[itemIndex].selectedSize = selectedSize;
    
    await cart.save();
    
    res.json({
      success: true,
      data: cart.items[itemIndex],
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('[Cart API] Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart: ' + error.message
    });
  }
});


router.delete('/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    console.log(`[Cart API] Removing item ${itemId} for user: ${req.user._id}`);
    
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    res.json({
      success: true,
      data: cart.items,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('[Cart API] Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart: ' + error.message
    });
  }
});

router.delete('/remove-multiple', protect, async (req, res) => {
  try {
    const { itemIds } = req.body;
    
    console.log(`[Cart API] Removing multiple items for user: ${req.user._id}`);
    console.log(`[Cart API] Item IDs to remove:`, itemIds);
    
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = cart.items.filter(item => !itemIds.includes(item._id.toString()));
    await cart.save();
    
    res.json({
      success: true,
      data: cart.items,
      message: 'Selected items removed from cart'
    });
  } catch (error) {
    console.error('[Cart API] Remove multiple items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove items from cart: ' + error.message
    });
  }
});


router.delete('/', protect, async (req, res) => {
  try {
    console.log(`[Cart API] Clearing cart for user: ${req.user._id}`);
    
    const cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('[Cart API] Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart: ' + error.message
    });
  }
});

module.exports = router;