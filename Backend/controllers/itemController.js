const Item = require('../models/Item');
const fs = require('fs');
const path = require('path');

exports.createItem = async (req, res, next) => {
    try {
        console.log('Creating item with data:', req.body);
        console.log('File:', req.file);

        const {
            name, description, price, unit, category, subCategory,
            stock, discount, featured, colors
        } = req.body;

        if (!name || !price || !category || stock === undefined) {
            if (req.file) {
                fs.unlink(req.file.path, () => {});
            }
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/items/${req.file.filename}`;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Product image is required'
            });
        }

        let colorsArray = [];
        if (colors) {
            if (Array.isArray(colors)) {
                colorsArray = colors;
            } else if (typeof colors === 'string') {
                colorsArray = colors.split(',').map(c => c.trim());
            }
        }

        const itemData = {
            name,
            description: description || '',
            price: parseFloat(price),
            unit: unit || 'piece',
            category,
            subCategory: subCategory || category,
            image: imagePath,
            stock: parseInt(stock),
            discount: discount ? parseFloat(discount) : 0,
            featured: featured === 'true' || featured === true,
            colors: colorsArray,
            inStock: parseInt(stock) > 0
        };

        if (itemData.discount > 0) {
            itemData.discountedPrice = itemData.price * (1 - itemData.discount / 100);
        } else {
            itemData.discountedPrice = itemData.price;
        }

        if (req.user) {
            itemData.userId = req.user.id;
            itemData.userModel = req.user.constructor.modelName;
        }

        const item = await Item.create(itemData);

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            data: item
        });

    } catch (error) {
        console.error('Create error:', error);
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        next(error);
    }
};

exports.getAllItems = async (req, res, next) => {
    try {
        console.log('Fetching all items');
        
        const {
            category,
            subCategory,
            featured,
            search,
            minPrice,
            maxPrice,
            inStock,
            sort,
            limit
        } = req.query;

        const filter = {};

        if (category && category !== 'all' && category !== 'undefined' && category !== 'null') {
            filter.category = category;
        }

        if (subCategory && subCategory !== 'all' && subCategory !== 'undefined' && subCategory !== 'null') {
            filter.subCategory = subCategory;
        }

        if (featured === 'true') {
            filter.featured = true;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        if (inStock === 'true') {
            filter.inStock = true;
        }

        let sortOption = { createdAt: -1 };
        if (sort) {
            const [field, order] = sort.split(':');
            sortOption = { [field]: order === 'asc' ? 1 : -1 };
        }

        let query = Item.find(filter).sort(sortOption);

        const limitNum = parseInt(limit);
        if (!isNaN(limitNum) && limitNum > 0) {
            query = query.limit(limitNum);
        }

        const items = await query;

        console.log(`Found ${items.length} items`);

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });

    } catch (error) {
        console.error('Get all error:', error);
        next(error);
    }
};

exports.getItemById = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });

    } catch (error) {
        console.error('Get by id error:', error);
        next(error);
    }
};

exports.updateItem = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        
        let item = await Item.findById(itemId);

        if (!item) {
            if (req.file) {
                fs.unlink(req.file.path, () => {});
            }
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        if (req.user && req.user.role !== 'admin' && 
            item.userId && item.userId.toString() !== req.user.id) {
            if (req.file) {
                fs.unlink(req.file.path, () => {});
            }
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this item'
            });
        }

        const updates = { ...req.body };

        if (req.body.price) updates.price = parseFloat(req.body.price);
        if (req.body.stock !== undefined) updates.stock = parseInt(req.body.stock);
        if (req.body.discount !== undefined) updates.discount = parseFloat(req.body.discount);

        if (req.body.featured !== undefined) {
            updates.featured = req.body.featured === 'true' || req.body.featured === true;
        }

        if (req.body.colors) {
            if (Array.isArray(req.body.colors)) {
                updates.colors = req.body.colors;
            } else if (typeof req.body.colors === 'string') {
                updates.colors = req.body.colors.split(',').map(c => c.trim());
            }
        }

        if (req.file) {
            if (item.image && item.image.startsWith('/uploads/items/')) {
                const oldImagePath = path.join(__dirname, '..', item.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updates.image = `/uploads/items/${req.file.filename}`;
        }

        if (updates.stock !== undefined) {
            updates.inStock = updates.stock > 0;
        }

        const price = updates.price !== undefined ? updates.price : item.price;
        const discount = updates.discount !== undefined ? updates.discount : item.discount;
        updates.discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;

        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedItem
        });

    } catch (error) {
        console.error('Update error:', error);
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        next(error);
    }
};

exports.deleteItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        if (req.user && req.user.role !== 'admin' && 
            item.userId && item.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this item'
            });
        }

        if (item.image && item.image.startsWith('/uploads/items/')) {
            const imagePath = path.join(__dirname, '..', item.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await item.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });

    } catch (error) {
        console.error('Delete error:', error);
        next(error);
    }
};

exports.getFeaturedItems = async (req, res, next) => {
    try {
        const items = await Item.find({ featured: true, inStock: true })
            .sort({ createdAt: -1 })
            .limit(8);

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });

    } catch (error) {
        console.error('Get featured error:', error);
        next(error);
    }
};

exports.getItemsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;

        const items = await Item.find({ category, inStock: true })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });

    } catch (error) {
        console.error('Get by category error:', error);
        next(error);
    }
};