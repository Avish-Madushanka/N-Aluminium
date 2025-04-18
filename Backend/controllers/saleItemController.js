const SaleItem = require('../models/saleItemModel');
const fs = require('fs');
const path = require('path');

const deleteSaleItemPhoto = (photoPath) => {
    if (!photoPath) return;
    const fullPath = path.join(__dirname, '..', photoPath);
    if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); console.log(`Deleted sale item photo: ${fullPath}`); }
        catch (err) { console.error(`Error deleting sale item photo ${fullPath}:`, err); }
    }
};

exports.addSaleItem = async (req, res) => {
    const { name, description, address, district, province, price, contact, type } = req.body;
    const imageFile = req.file;
    if (!name || !description || !address || !district || !province || !price || !contact || !type || !imageFile) {
        if(imageFile) { deleteSaleItemPhoto(`/uploads/sale_items/${imageFile.filename}`); }
        return res.status(400).json({ success: false, message: 'Please provide all required fields, including an image.' });
    }
    try {
        const imagePath = `/uploads/sale_items/${imageFile.filename}`;
        const newItem = new SaleItem({ name, description, address, district, province, price: Number(price), contact, type, image: imagePath });
        const savedItem = await newItem.save();
        res.status(201).json({ success: true, message: 'Sale item added successfully!', data: savedItem });
    } catch (error) {
        if(imageFile) { deleteSaleItemPhoto(`/uploads/sale_items/${imageFile.filename}`); }
        console.error("Add Sale Item Error:", error);
        if (error.name === 'ValidationError') { return res.status(400).json({ success: false, message: Object.values(error.errors).map(val => val.message).join('. ') }); }
        res.status(500).json({ success: false, message: 'Server error while adding sale item.' });
    }
};

exports.getAllSaleItems = async (req, res) => {
    try {
        const items = await SaleItem.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        console.error("Get All Sale Items Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching sale items.' });
    }
};