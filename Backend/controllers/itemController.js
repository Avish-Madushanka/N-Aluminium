const Item = require('../models/Item');
const path = require('path');
const fs = require('fs');

exports.createItem = async (req, res, next) => {
    try {
        console.log('Creating item with data:', req.body);
        console.log('File:', req.file);

        const {
            name, description, price, unit, category, subCategory,
            stock, discount, featured, colors, sizes
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

        if (!req.file) {
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

        let sizesArray = [];
        if (sizes) {
            if (Array.isArray(sizes)) {
                sizesArray = sizes;
            } else if (typeof sizes === 'string') {
                sizesArray = sizes.split(',').map(s => s.trim());
            }
        }

        const imagePath = `/uploads/items/${req.file.filename}`;

        const itemData = {
            name,
            description: description || '',
            price: parseFloat(price),
            unit: unit || 'piece',
            category,
            subCategory: subCategory || category,
            image: imagePath,
            stock: parseInt(stock) || 0,
            discount: parseFloat(discount) || 0,
            featured: featured === 'true' || featured === true,
            colors: colorsArray,
            sizes: sizesArray,
            inStock: parseInt(stock) > 0
        };

        if (itemData.discount > 0) {
            itemData.discountedPrice = itemData.price * (1 - itemData.discount / 100);
        }

        if (req.user) {
            itemData.userId = req.user._id;
            itemData.userModel = req.user.role === 'admin' ? 'Admin' : 
                                req.user.role === 'businessOwner' ? 'BusinessOwner' : 'Client';
        }

        const item = await Item.create(itemData);

        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            data: item
        });

    } catch (error) {
        console.error('Create item error:', error);
        
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(' ')
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create item',
            error: error.message
        });
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

        let query = Item.find(filter).sort(sortOption).populate('userId', 'name email');

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
        console.error('Get all items error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch items',
            error: error.message
        });
    }
};

exports.getItemById = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id).populate('userId', 'name email');

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
        console.error('Get item by id error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid item ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to fetch item',
            error: error.message
        });
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
            item.userId && item.userId.toString() !== req.user._id.toString()) {
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

        if (req.body.sizes) {
            if (Array.isArray(req.body.sizes)) {
                updates.sizes = req.body.sizes;
            } else if (typeof req.body.sizes === 'string') {
                updates.sizes = req.body.sizes.split(',').map(s => s.trim());
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
        ).populate('userId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedItem
        });

    } catch (error) {
        console.error('Update item error:', error);
        
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(' ')
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update item',
            error: error.message
        });
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
            item.userId && item.userId.toString() !== req.user._id.toString()) {
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
        console.error('Delete item error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid item ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to delete item',
            error: error.message
        });
    }
};

exports.getFeaturedItems = async (req, res, next) => {
    try {
        const items = await Item.find({ featured: true, inStock: true })
            .sort({ createdAt: -1 })
            .limit(8)
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });

    } catch (error) {
        console.error('Get featured items error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured items',
            error: error.message
        });
    }
};

exports.getItemsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;

        const items = await Item.find({ category, inStock: true })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });

    } catch (error) {
        console.error('Get items by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch items',
            error: error.message
        });
    }
};