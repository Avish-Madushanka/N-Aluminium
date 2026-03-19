const QuotationRequest = require('../models/QuotationRequest');
const Client = require('../models/Client');
const BusinessOwner = require('../models/BusinessOwner');

exports.createQuotationRequest = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in quotation request'
      });
    }

    let userModel = 'Client';
    let user = await Client.findById(req.user._id);
    
    if (!user) {
      user = await BusinessOwner.findById(req.user._id);
      userModel = 'BusinessOwner';
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let userName = '';
    if (userModel === 'Client') {
      userName = user.fullName || '';
    } else {
      userName = user.ownerName || user.businessName || '';
    }

    const quotationRequest = new QuotationRequest({
      userId: req.user._id,
      userModel,
      userDetails: {
        name: userName || 'User',
        email: user.email || '',
        phone: user.phone || user.contactNumber || ''
      },
      items: items.map(item => ({
        itemId: item.itemId || item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discountedPrice: item.discountedPrice || item.price,
        selectedColor: item.selectedColor || '',
        selectedSize: item.selectedSize || '',
        image: item.image || '',
        unit: item.unit || 'piece',
        discount: item.discount || 0
      })),
      totalAmount,
      status: 'pending'
    });

    await quotationRequest.save();

    res.status(201).json({
      success: true,
      message: 'Quotation request submitted successfully',
      data: quotationRequest
    });
  } catch (error) {
    console.error('Create quotation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quotation request: ' + error.message
    });
  }
};

exports.getAllQuotationRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const quotations = await QuotationRequest.find(filter)
      .populate('userId', 'name email fullName ownerName businessName phone contactNumber')
      .sort({ requestedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await QuotationRequest.countDocuments(filter);

    res.json({
      success: true,
      data: quotations,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Get quotations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quotation requests: ' + error.message
    });
  }
};

exports.getQuotationRequestById = async (req, res) => {
  try {
    const quotation = await QuotationRequest.findById(req.params.id)
      .populate('userId', 'name email fullName ownerName businessName phone contactNumber');

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation request not found'
      });
    }

    res.json({
      success: true,
      data: quotation
    });
  } catch (error) {
    console.error('Get quotation by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quotation request: ' + error.message
    });
  }
};

exports.getUserQuotationRequests = async (req, res) => {
  try {
    const quotations = await QuotationRequest.find({ userId: req.user._id })
      .sort({ requestedAt: -1 });

    res.json({
      success: true,
      data: quotations
    });
  } catch (error) {
    console.error('Get user quotations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your quotation requests: ' + error.message
    });
  }
};

exports.updateQuotationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const { id } = req.params;

    if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const quotation = await QuotationRequest.findById(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation request not found'
      });
    }

    quotation.status = status;
    if (adminNotes !== undefined) {
      quotation.adminNotes = adminNotes;
    }
    quotation.respondedAt = new Date();

    await quotation.save();

    res.json({
      success: true,
      message: `Quotation request ${status} successfully`,
      data: quotation
    });
  } catch (error) {
    console.error('Update quotation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quotation status: ' + error.message
    });
  }
};

exports.deleteQuotationRequest = async (req, res) => {
  try {
    const quotation = await QuotationRequest.findById(req.params.id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: 'Quotation request not found'
      });
    }

    if (req.user.role !== 'admin' && quotation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this quotation'
      });
    }

    await quotation.deleteOne();

    res.json({
      success: true,
      message: 'Quotation request deleted successfully'
    });
  } catch (error) {
    console.error('Delete quotation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete quotation request: ' + error.message
    });
  }
};

exports.getQuotationStats = async (req, res) => {
  try {
    const total = await QuotationRequest.countDocuments();
    const pending = await QuotationRequest.countDocuments({ status: 'pending' });
    const approved = await QuotationRequest.countDocuments({ status: 'approved' });
    const rejected = await QuotationRequest.countDocuments({ status: 'rejected' });
    const completed = await QuotationRequest.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        completed
      }
    });
  } catch (error) {
    console.error('Get quotation stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quotation statistics: ' + error.message
    });
  }
};