const ShopLocation = require('../models/ShopLocation');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');

exports.createShopLocation = asyncHandler(async (req, res, next) => {
    const { name, address, phone, hours, additional, type, position } = req.body;

    if (!name || !address || !type || !position || typeof position.lat !== 'number' || typeof position.lng !== 'number') {
        return next(new ErrorResponse('Please provide name, address, type, and valid position (lat, lng as numbers).', 400));
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

    console.log('[ShopCtrl Create] Shop location created:', shopLocation._id);
    res.status(201).json({
        success: true,
        data: shopLocation,
        message: 'Shop location created successfully.'
    });
});

exports.getAllShopLocations = asyncHandler(async (req, res, next) => {
    const shopLocations = await ShopLocation.find({}).sort({ createdAt: -1 });
    console.log(`[ShopCtrl GetAll] Found ${shopLocations.length} shop locations.`);
    res.status(200).json({
        success: true,
        count: shopLocations.length,
        data: shopLocations
    });
});

exports.getShopLocationById = asyncHandler(async (req, res, next) => {
    const shopLocation = await ShopLocation.findById(req.params.id);

    if (!shopLocation) {
        console.warn(`[ShopCtrl GetById] Shop location not found with id: ${req.params.id}`);
        return next(new ErrorResponse(`Shop location not found with id of ${req.params.id}`, 404));
    }
    console.log(`[ShopCtrl GetById] Found shop location: ${shopLocation._id}`);
    res.status(200).json({
        success: true,
        data: shopLocation
    });
});

exports.updateShopLocation = asyncHandler(async (req, res, next) => {
    let shopLocation = await ShopLocation.findById(req.params.id);

    if (!shopLocation) {
        console.warn(`[ShopCtrl Update] Shop location for update not found: ${req.params.id}`);
        return next(new ErrorResponse(`Shop location not found with id of ${req.params.id}`, 404));
    }

    const { name, address, phone, hours, additional, type, position } = req.body;
    const updateData = { ...req.body }; 

    if (position && (typeof position.lat !== 'number' || typeof position.lng !== 'number')) {
        return next(new ErrorResponse('If position is provided for update, it must include lat and lng as numbers.', 400));
    }
    
    if (type && (additional === undefined || additional.trim() === '' || shopLocation.type !== type)) {
        const typeLabels = { main: "Main Branch", partner: "Partner Store", outlet: "Outlet" };
        updateData.additional = (additional && additional.trim() !== '') ? additional.trim() : (typeLabels[type] || type);
    }

    shopLocation = await ShopLocation.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true
    });

    console.log(`[ShopCtrl Update] Shop location updated: ${shopLocation._id}`);
    res.status(200).json({
        success: true,
        data: shopLocation,
        message: 'Shop location updated successfully.'
    });
});

exports.deleteShopLocation = asyncHandler(async (req, res, next) => {
    const shopLocation = await ShopLocation.findById(req.params.id);

    if (!shopLocation) {
        console.warn(`[ShopCtrl Delete] Shop location for delete not found: ${req.params.id}`);
        return next(new ErrorResponse(`Shop location not found with id of ${req.params.id}`, 404));
    }

    await shopLocation.deleteOne();
    console.log(`[ShopCtrl Delete] Shop location deleted: ${req.params.id}`);
    res.status(200).json({
        success: true,
        data: {},
        message: 'Shop location deleted successfully.'
    });
});