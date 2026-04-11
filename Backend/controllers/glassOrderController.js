const GlassOrder = require('../models/GlassOrder');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../utils/glassEmailService');

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    const newOrder = new GlassOrder({
      items: orderData.items,
      userInfo: orderData.userInfo,
      deliveryMethod: orderData.deliveryMethod,
      totalGlassPrice: orderData.totalGlassPrice,
      transportCost: orderData.transportCost,
      insuranceCost: orderData.insuranceCost,
      grandTotal: orderData.grandTotal,
      totalWeight: orderData.totalWeight,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: 'paid',
      paypalTransactionId: orderData.paypalTransactionId,
      pickupDate: orderData.pickupDate,
      pickupTimeSlot: orderData.pickupTimeSlot,
      deliveryAddress: orderData.deliveryAddress,
      selectedLocation: orderData.selectedLocation,
      distance: orderData.distance,
      deliveryDate: orderData.deliveryDate,
      deliveryTimeSlot: orderData.deliveryTimeSlot,
      urgentDelivery: orderData.urgentDelivery,
      insurance: orderData.insurance,
      status: 'pending',
      orderStatusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed and payment confirmed'
      }]
    });
    
    if (orderData.deliveryMethod === 'delivery') {
      newOrder.driverDetails = {
        name: "Kamal Perera",
        contact: "0771234567",
        vehicleNumber: "ABC-1234"
      };
    }
    
    await newOrder.save();
    
    await sendOrderConfirmationEmail(newOrder);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await GlassOrder.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await GlassOrder.countDocuments(query);
    
    res.json({
      success: true,
      data: orders,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await GlassOrder.findOne({ orderId: req.params.id });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order by id error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const { id } = req.params;
    
    const order = await GlassOrder.findOne({ orderId: id });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    order.status = status;
    order.orderStatusHistory.push({
      status: status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });
    order.updatedAt = Date.now();
    
    await order.save();
    
    await sendOrderStatusUpdateEmail(order, status, note);
    
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const total = await GlassOrder.countDocuments();
    const pending = await GlassOrder.countDocuments({ status: 'pending' });
    const processing = await GlassOrder.countDocuments({ status: 'processing' });
    const dispatched = await GlassOrder.countDocuments({ status: 'dispatched' });
    const ontheway = await GlassOrder.countDocuments({ status: 'ontheway' });
    const delivered = await GlassOrder.countDocuments({ status: 'delivered' });
    
    const revenueResult = await GlassOrder.aggregate([
      { $group: { _id: null, total: { $sum: '$grandTotal' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    res.json({
      success: true,
      data: { total, pending, processing, dispatched, ontheway, delivered, totalRevenue }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;
    
    const orders = await GlassOrder.find({ 'userInfo.email': email })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};