const ShopLocation = require('../models/ShopLocation');
const asyncHandler = require('../utils/async'); 
const ErrorResponse = require('../utils/errorResponse'); 

exports.createShopLocation = asyncHandler(async (req, res, next) => {
    const { name, address, phone, hours, additional, type, position } = req.body;

    if (!name || !address || !type || !position || !position.lat || !position.lng) {
        return next(new ErrorResponse('Please provide name, address, type, and valid position (lat, lng).', 400));
    }

    const typeLabels = {
      main: "Main Branch",
      partner: "Partner Store",
      outlet: "Outlet"
    };
    const finalAdditional = additional || typeLabels[type] || type;


    const shopLocation = await ShopLocation.create({
        name,
        address,
        phone,
        hours,
        additional: finalAdditional,
        type,
        position
    });

    res.status(201).json({
        success: true,
        data: shopLocation,
        message: 'Shop location created successfully.'
    });
});

exports.getAllShopLocations = asyncHandler(async (req, res, next) => {
    let query = {};
    if (req.query.type) {
        query.type = req.query.type;
    }

    const shopLocations = await ShopLocation.find(query).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: shopLocations.length,
        data: shopLocations
    });
});

exports.getShopLocationById = asyncHandler(async (req, res, next) => {
    const shopLocation = await ShopLocation.findById(req.params.id);

    if (!shopLocation) {
        return next(new ErrorResponse(`Shop location not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: shopLocation
    });
});

exports.updateShopLocation = asyncHandler(async (req, res, next) => {
    let shopLocation = await ShopLocation.findById(req.params.id);

    if (!shopLocation) {
        return next(new ErrorResponse(`Shop location not found with id of ${req.params.id}`, 404));
    }

    const { name, address, phone, hours, additional, type, position } = req.body;

    const updateData = { ...req.body };

    if (position && (position.lat === undefined || position.lng === undefined)) {
        return next(new ErrorResponse('If position is provided, it must include lat and lng.', 400));
    }

    if (type && (additional === undefined || additional === '' || shopLocation.type !== type)) {
        const typeLabels = {
            main: "Main Branch",
            partner: "Partner Store",
            outlet: "Outlet"
        };
        updateData.additional = additional || typeLabels[type] || type;
    }


    shopLocation = await ShopLocation.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: shopLocation,
        message: 'Shop location updated successfully.'
    });
});

exports.deleteShopLocation = asyncHandler(async (req, res, next) => {
    const shopLocation = await ShopLocation.findById(req.params.id);

    if (!shopLocation) {
        return next(new ErrorResponse(`Shop location not found with id of ${req.params.id}`, 404));
    }

    await shopLocation.deleteOne(); 

    res.status(200).json({
        success: true,
        data: {},
        message: 'Shop location deleted successfully.'
    });
});