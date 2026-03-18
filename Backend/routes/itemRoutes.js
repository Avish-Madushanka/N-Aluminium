const Item = require('../models/Item');
const path = require('path');
const fs = require('fs');

exports.createItem = async (req, res) => {
    try {
        const {
            name, description, price, unit, category, subCategory,
            stock, discount, featured, colors, sizes
        } = req.body;

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

        const imagePath = `/uploads/${req.file.filename}`;

        const itemData = {
            name,
            description,
            price: parseFloat(price),
            unit,
            category,
            subCategory: subCategory || category,
            image: imagePath,
            stock: parseInt(stock) || 0,
            discount: parseFloat(discount) || 0,
            featured: featured === 'true' || featured === true,
            colors: colorsArray,
            sizes: sizesArray,
            userId: req.user._id,
            userModel: req.user.role === 'admin' ? 'Admin' : 
                      req.user.role === 'businessOwner' ? 'BusinessOwner' : 'Client'
        };

        if (isNaN(itemData.price) || itemData.price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid price is required'
            });
        }

        const item = new Item(itemData);
        await item.save();

        res.status(201).json({
            success: true,
            data: item,
            message: 'Item created successfully'
        });

    } catch (error) {
        console.error('Create item error:', error);
        
        if (req.file) {
            const filePath = path.join(__dirname, '../../uploads', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create item',
            error: error.message
        });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        
        if (category && category !== 'all' && category !== 'undefined' && category !== 'null') {
            query.category = category;
        }
        
        const items = await Item.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.json({
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

exports.getFeaturedItems = async (req, res) => {
    try {
        const items = await Item.find({ featured: true })
            .sort({ createdAt: -1 })
            .limit(8)
            .populate('userId', 'name email');

        res.json({
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

exports.getItemsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        
        const items = await Item.find({ category })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.json({
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

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('userId', 'name email');

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        console.error('Get item by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch item',
            error: error.message
        });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        const updateData = { ...req.body };

        if (req.file) {
            if (item.image) {
                const oldImagePath = path.join(__dirname, '../../', item.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            updateData.image = `/uploads/${req.file.filename}`;
        }

        if (updateData.colors) {
            updateData.colors = Array.isArray(updateData.colors) 
                ? updateData.colors 
                : updateData.colors.split(',').map(c => c.trim());
        }

        if (updateData.sizes) {
            updateData.sizes = Array.isArray(updateData.sizes) 
                ? updateData.sizes 
                : updateData.sizes.split(',').map(s => s.trim());
        }

        if (updateData.price) updateData.price = parseFloat(updateData.price);
        if (updateData.stock) updateData.stock = parseInt(updateData.stock);
        if (updateData.discount) updateData.discount = parseFloat(updateData.discount);
        updateData.featured = updateData.featured === 'true' || updateData.featured === true;

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedItem,
            message: 'Item updated successfully'
        });

    } catch (error) {
        console.error('Update item error:', error);
        
        if (req.file) {
            const filePath = path.join(__dirname, '../../uploads', req.file.filename);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update item',
            error: error.message
        });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        if (item.image) {
            const imagePath = path.join(__dirname, '../../', item.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        await item.deleteOne();

        res.json({
            success: true,
            message: 'Item deleted successfully'
        });

    } catch (error) {
        console.error('Delete item error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete item',
            error: error.message
        });
    }
};