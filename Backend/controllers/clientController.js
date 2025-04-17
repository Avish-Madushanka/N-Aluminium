// --- START OF FILE controllers/clientController.js ---
const Client = require('../models/clientModel');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const deletePhoto = (photoPath) => {
    if (photoPath && photoPath !== '') {
        const fullPath = path.join(__dirname, '..', photoPath);
        if (fs.existsSync(fullPath)) {
            try { fs.unlinkSync(fullPath); console.log(`Deleted photo: ${fullPath}`); }
            catch (err) { console.error(`Error deleting photo ${fullPath}:`, err); }
        }
    }
};

exports.registerClient = async (req, res) => {
    const { name, email, contactNumber, password, address, district, province } = req.body;
    const photoFile = req.file;
    try {
        if (!name || !email || !contactNumber || !password || !address || !district || !province) {
            if (photoFile) deletePhoto(`/uploads/profiles/${photoFile.filename}`);
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        const clientExists = await Client.findOne({ email });
        if (clientExists) {
            if (photoFile) deletePhoto(`/uploads/profiles/${photoFile.filename}`);
            return res.status(400).json({ success: false, message: 'Client with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const profilePhotoPath = photoFile ? `/uploads/profiles/${photoFile.filename}` : '';
        const newClient = new Client({ name, email, contactNumber, address, district, province, password: hashedPassword, profilePhoto: profilePhotoPath });
        const savedClient = await newClient.save();
        const clientData = savedClient.toObject();
        delete clientData.password;
        res.status(201).json({ success: true, message: 'Client registered successfully', data: clientData });
    } catch (error) {
        if (photoFile) deletePhoto(`/uploads/profiles/${photoFile.filename}`);
        console.error("Register Client Error:", error);
         if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join('. ') });
        }
        res.status(500).json({ success: false, message: 'Server Error during registration' });
    }
};

exports.getClientById = async (req, res) => {
  try {
    if (!req.user || (req.user.id !== req.params.id && req.user.role !== 'admin')) {
         return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const client = await Client.findById(req.params.id).select('-password');
    if (!client) { return res.status(404).json({ success: false, message: 'Client not found' }); }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    console.error("Get Client By ID Error:", error);
     if (error.kind === 'ObjectId') { return res.status(400).json({ success: false, message: 'Invalid client ID format' }); }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.updateClient = async (req, res) => {
    const { name, email, contactNumber, address, district, province, password } = req.body;
    const photoFile = req.file;
    try {
        if (!req.user || (req.user.id !== req.params.id && req.user.role !== 'admin')) {
            if (photoFile) deletePhoto(`/uploads/profiles/${photoFile.filename}`);
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const clientToUpdate = await Client.findById(req.params.id);
        if (!clientToUpdate) {
            if (photoFile) deletePhoto(`/uploads/profiles/${photoFile.filename}`);
            return res.status(404).json({ success: false, message: 'Client not found' });
        }
        const oldPhotoPath = clientToUpdate.profilePhoto;
        clientToUpdate.name = name || clientToUpdate.name;
        clientToUpdate.email = email || clientToUpdate.email;
        clientToUpdate.contactNumber = contactNumber || clientToUpdate.contactNumber;
        clientToUpdate.address = address || clientToUpdate.address;
        clientToUpdate.district = district || clientToUpdate.district;
        clientToUpdate.province = province || clientToUpdate.province;
        if (photoFile) {
            clientToUpdate.profilePhoto = `/uploads/profiles/${photoFile.filename}`;
            if (oldPhotoPath && oldPhotoPath !== clientToUpdate.profilePhoto) { deletePhoto(oldPhotoPath); }
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            clientToUpdate.password = await bcrypt.hash(password, salt);
        }
        const updatedClient = await clientToUpdate.save();
        const clientData = updatedClient.toObject();
        delete clientData.password;
        res.status(200).json({ success: true, message: 'Client updated successfully', data: clientData });
    } catch (error) {
        if (photoFile) deletePhoto(`/uploads/profiles/${photoFile.filename}`);
        console.error("Update Client Error:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join('. ') });
        }
        if (error.code === 11000) { return res.status(400).json({ success: false, message: 'Email already in use.' }); }
        res.status(500).json({ success: false, message: 'Server Error during update' });
    }
};

exports.deleteClient = async (req, res) => {
  try {
     if (!req.user || (req.user.id !== req.params.id && req.user.role !== 'admin')) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const client = await Client.findById(req.params.id);
    if (!client) { return res.status(404).json({ success: false, message: 'Client not found' }); }
    const photoPathToDelete = client.profilePhoto;
    await Client.deleteOne({ _id: req.params.id });
    deletePhoto(photoPathToDelete);
    res.status(200).json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error("Delete Client Error:", error);
     if (error.kind === 'ObjectId') { return res.status(400).json({ success: false, message: 'Invalid client ID format' }); }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
// --- END OF FILE controllers/clientController.js ---