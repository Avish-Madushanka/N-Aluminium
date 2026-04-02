const SaleItem = require('../models/SaleItem');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');

exports.createSaleItem = asyncHandler(async (req, res, next) => {
    const { name, description, price, oldPrice, type, condition, brand, address, phoneNumber } = req.body;

    if (!name || !description || !address || !price || !phoneNumber || !type) {
        return next(new ErrorResponse('Required fields are missing', 400));
    }

    let mainImagePath = null;
    if (req.files && req.files.imagePath && req.files.imagePath[0]) {
        mainImagePath = `/uploads/saleitems/${req.files.imagePath[0].filename}`;
    } else {
        return next(new ErrorResponse('Main image is required', 400));
    }

    let additionalImagesPaths = [];
    if (req.files && req.files.additionalImages) {
        additionalImagesPaths = req.files.additionalImages.map(
            file => `/uploads/saleitems/${file.filename}`
        );
    }

    let userModel = 'Client';
    if (req.user.role === 'admin') userModel = 'Admin';
    else if (req.user.role === 'businessOwner') userModel = 'BusinessOwner';

    const saleItem = await SaleItem.create({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : Number(price),
        type: type,
        condition: condition,
        brand: brand,
        address: address,
        phoneNumber: phoneNumber,
        imagePath: mainImagePath,
        additionalImages: additionalImagesPaths,
        userId: req.user.id,
        userModel: userModel
    });

    res.status(201).json({ 
        success: true, 
        data: saleItem 
    });
});

exports.getAllSaleItems = asyncHandler(async (req, res, next) => {
    const saleItems = await SaleItem.find({ isSold: false, isActive: true })
        .populate('userId', 'name email fullName ownerName')
        .sort({ createdAt: -1 });

    res.status(200).json({ 
        success: true, 
        count: saleItems.length, 
        data: saleItems 
    });
});

exports.getSaleItemById = asyncHandler(async (req, res, next) => {
    const saleItem = await SaleItem.findById(req.params.id).populate('userId', 'name email fullName ownerName');
    if (!saleItem) return next(new ErrorResponse('Item not found', 404));
    res.status(200).json({ success: true, data: saleItem });
});

exports.deleteSaleItem = asyncHandler(async (req, res, next) => {
    const saleItem = await SaleItem.findById(req.params.id);
    if (!saleItem) return next(new ErrorResponse('Item not found', 404));
    
    if (saleItem.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Unauthorized', 403));
    }

    await saleItem.deleteOne();
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});