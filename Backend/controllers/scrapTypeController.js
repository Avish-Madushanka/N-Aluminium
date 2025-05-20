const ScrapType = require('../models/ScrapType');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');

exports.createScrapType = asyncHandler(async (req, res, next) => {
    const { name, price, unit, description, isActive } = req.body;

    if (!name || price === undefined) {
        return next(new ErrorResponse('Please provide name and price for the scrap type.', 400));
    }

    const existingScrapType = await ScrapType.findOne({ name });
    if (existingScrapType) {
        return next(new ErrorResponse(`Scrap type with name '${name}' already exists.`, 400));
    }

    const scrapType = await ScrapType.create({
        name,
        price,
        unit: unit || 'kg', 
        description,
        isActive: isActive === undefined ? true : isActive,
    });

    res.status(201).json({
        success: true,
        message: 'Scrap type created successfully.',
        data: scrapType,
    });
});

exports.getAllScrapTypes = asyncHandler(async (req, res, next) => {
    let query;

    const filter = {};
    if (req.query.active === 'true') {
        filter.isActive = true;
    } else if (req.query.active === 'false' && req.user?.role === 'admin') {
        filter.isActive = false;
    } else if (req.user?.role !== 'admin') { 
        filter.isActive = true;
    }

    const scrapTypes = await ScrapType.find(filter).sort({ name: 1 });

    res.status(200).json({
        success: true,
        count: scrapTypes.length,
        data: scrapTypes,
    });
});

exports.getScrapTypeById = asyncHandler(async (req, res, next) => {
    const scrapType = await ScrapType.findById(req.params.id);

    if (!scrapType) {
        return next(new ErrorResponse(`Scrap type not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: scrapType,
    });
});

exports.updateScrapType = asyncHandler(async (req, res, next) => {
    const { name, price, unit, description, isActive } = req.body;
    const scrapTypeId = req.params.id;

    let scrapType = await ScrapType.findById(scrapTypeId);

    if (!scrapType) {
        return next(new ErrorResponse(`Scrap type not found with id of ${scrapTypeId}`, 404));
    }

    if (name && name !== scrapType.name) {
        const existingScrapType = await ScrapType.findOne({ name });
        if (existingScrapType && existingScrapType._id.toString() !== scrapTypeId) {
            return next(new ErrorResponse(`Scrap type with name '${name}' already exists.`, 400));
        }
        scrapType.name = name;
    }

    if (price !== undefined) scrapType.price = price;
    if (unit !== undefined) scrapType.unit = unit;
    if (description !== undefined) scrapType.description = description;
    if (isActive !== undefined) scrapType.isActive = isActive;

    await scrapType.save();

    res.status(200).json({
        success: true,
        message: 'Scrap type updated successfully.',
        data: scrapType,
    });
});

exports.deleteScrapType = asyncHandler(async (req, res, next) => {
    const scrapType = await ScrapType.findById(req.params.id);

    if (!scrapType) {
        return next(new ErrorResponse(`Scrap type not found with id of ${req.params.id}`, 404));
    }

    scrapType.isActive = false;
    await scrapType.save();

    res.status(200).json({
        success: true,
        message: `Scrap type '${scrapType.name}' deactivated successfully.`,
        data: {}, 
    });
});

exports.forceDeleteScrapType = asyncHandler(async (req, res, next) => {
    const scrapType = await ScrapType.findByIdAndDelete(req.params.id);

    if (!scrapType) {
        return next(new ErrorResponse(`Scrap type not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: `Scrap type '${scrapType.name}' permanently deleted.`,
        data: {},
    });
});