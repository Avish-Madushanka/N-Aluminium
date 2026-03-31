const BuyAndSellItem = require('../models/BuyAndSellItem');
const path = require('path');
const fs = require('fs');

exports.createItem = async (req, res) => {
    try {
        console.log('=== CREATE ITEM DEBUG ===');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        console.log('Request user:', req.user);
        
        const {
            name,
            description,
            price,
            oldPrice,
            type,
            condition,
            brand,
            address,
            phoneNumber
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Product name is required'
            });
        }
        
        if (!price) {
            return res.status(400).json({
                success: false,
                message: 'Price is required'
            });
        }
        
        if (!type) {
            return res.status(400).json({
                success: false,
                message: 'Category is required'
            });
        }
        
        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Address is required'
            });
        }
        
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        if (!req.files || !req.files.imagePath) {
            return res.status(400).json({
                success: false,
                message: 'Main image is required'
            });
        }

        const imageFile = req.files.imagePath[0];
        const imagePath = `/uploads/saleitems/${imageFile.filename}`;
        
        let additionalImagePaths = [];
        if (req.files.additionalImages && req.files.additionalImages.length > 0) {
            additionalImagePaths = req.files.additionalImages.map(file => `/uploads/saleitems/${file.filename}`);
        }

        const itemData = {
            name: name.trim(),
            description: description ? description.trim() : '',
            price: parseFloat(price),
            oldPrice: oldPrice ? parseFloat(oldPrice) : null,
            type: type,
            condition: condition || 'Good',
            brand: brand ? brand.trim() : '',
            address: address.trim(),
            phoneNumber: phoneNumber.trim(),
            imagePath: imagePath,
            additionalImages: additionalImagePaths,
            userId: req.user._id,
            userModel: req.user.role === 'admin' ? 'Admin' : 
                       req.user.role === 'businessOwner' ? 'BusinessOwner' : 'Client',
            status: 'active'
        };

        console.log('Creating item with data:', itemData);

        const item = await BuyAndSellItem.create(itemData);

        res.status(201).json({
            success: true,
            message: 'Item added successfully',
            data: item
        });

    } catch (error) {
        console.error('Create item error:', error);
        
        if (req.files) {
            if (req.files.imagePath) {
                req.files.imagePath.forEach(file => {
                    fs.unlink(file.path, () => {});
                });
            }
            if (req.files.additionalImages) {
                req.files.additionalImages.forEach(file => {
                    fs.unlink(file.path, () => {});
                });
            }
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create item'
        });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const { type, condition, search, sort, limit = 50 } = req.query;
        
        const filter = { status: 'active' };
        
        if (type && type !== 'all' && type !== '') {
            filter.type = type;
        }
        
        if (condition && condition !== 'all' && condition !== '') {
            filter.condition = condition;
        }
        
        if (search && search.trim()) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }
        
        let sortOption = { createdAt: -1 };
        if (sort === 'price-low-high') {
            sortOption = { price: 1 };
        } else if (sort === 'price-high-low') {
            sortOption = { price: -1 };
        }
        
        const items = await BuyAndSellItem.find(filter)
            .sort(sortOption)
            .limit(parseInt(limit))
            .populate('userId', 'name email fullName ownerName');
        
        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
        
    } catch (error) {
        console.error('Get items error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch items',
            error: error.message
        });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await BuyAndSellItem.findById(req.params.id)
            .populate('userId', 'name email fullName ownerName');
        
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
        console.error('Get item error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch item',
            error: error.message
        });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await BuyAndSellItem.findById(req.params.id);
        
        if (!item) {
            if (req.files && req.files.imagePath) {
                req.files.imagePath.forEach(file => fs.unlink(file.path, () => {}));
            }
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            if (req.files && req.files.imagePath) {
                req.files.imagePath.forEach(file => fs.unlink(file.path, () => {}));
            }
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this item'
            });
        }
        
        const updates = { ...req.body };
        
        if (req.body.price) updates.price = parseFloat(req.body.price);
        if (req.body.oldPrice) updates.oldPrice = parseFloat(req.body.oldPrice);
        
        if (req.files && req.files.imagePath) {
            if (item.imagePath && item.imagePath.startsWith('/uploads/saleitems/')) {
                const oldImagePath = path.join(__dirname, '..', item.imagePath);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updates.imagePath = `/uploads/saleitems/${req.files.imagePath[0].filename}`;
        }
        
        if (req.files && req.files.additionalImages) {
            const newImages = req.files.additionalImages.map(file => `/uploads/saleitems/${file.filename}`);
            updates.additionalImages = [...item.additionalImages, ...newImages];
        }
        
        const updatedItem = await BuyAndSellItem.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('userId', 'name email fullName ownerName');
        
        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedItem
        });
        
    } catch (error) {
        console.error('Update item error:', error);
        
        if (req.files && req.files.imagePath) {
            req.files.imagePath.forEach(file => fs.unlink(file.path, () => {}));
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
        const item = await BuyAndSellItem.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this item'
            });
        }
        
        if (item.imagePath && item.imagePath.startsWith('/uploads/saleitems/')) {
            const imagePath = path.join(__dirname, '..', item.imagePath);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        if (item.additionalImages && item.additionalImages.length > 0) {
            item.additionalImages.forEach(imgPath => {
                const fullPath = path.join(__dirname, '..', imgPath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }
        
        await item.deleteOne();
        
        res.status(200).json({
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

exports.getUserItems = async (req, res) => {
    try {
        const items = await BuyAndSellItem.find({ userId: req.user._id })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
        
    } catch (error) {
        console.error('Get user items error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch your items',
            error: error.message
        });
    }
};

exports.updateItemStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        
        if (!['active', 'sold', 'inactive'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        const item = await BuyAndSellItem.findById(id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }
        
        if (item.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this item'
            });
        }
        
        item.status = status;
        await item.save();
        
        res.status(200).json({
            success: true,
            message: `Item marked as ${status}`,
            data: item
        });
        
    } catch (error) {
        console.error('Update item status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update item status',
            error: error.message
        });
    }
};