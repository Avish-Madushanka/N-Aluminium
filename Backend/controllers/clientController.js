const Client = require('../models/Client');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'profiles');

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

exports.registerClient = async (req, res, next) => {
    try {
        const { fullName, email, phone, password } = req.body;
        
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide fullName, email, phone and password.' 
            });
        }
        
        const existingClient = await Client.findOne({ email: email.toLowerCase() });
        if (existingClient) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered.' 
            });
        }

        const newClient = new Client({ 
            fullName, 
            email: email.toLowerCase(), 
            phone, 
            password 
        });
        
        if (req.file) {
            newClient.profilePhoto = `/uploads/profiles/${req.file.filename}`;
        }
        
        await newClient.save();
        
        const clientResponse = newClient.toObject();
        delete clientResponse.password;
        
        res.status(201).json({ 
            success: true, 
            message: 'Client registered successfully.', 
            data: clientResponse 
        });
    } catch (error) { 
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered.' 
            });
        }
        next(error); 
    }
};

exports.getClientProfile = async (req, res, next) => {
    const requestedId = req.params.id;
    
    try {
        if (!mongoose.Types.ObjectId.isValid(requestedId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid client ID format.' 
            });
        }
        
        const client = await Client.findById(requestedId).select('-password');
        
        if (!client) {
            return res.status(404).json({ 
                success: false, 
                message: 'Client profile not found.' 
            });
        }
        
        res.status(200).json({ success: true, data: client });
    } catch (error) { 
        next(error); 
    }
};

exports.updateClientProfile = async (req, res, next) => {
    const clientIdToUpdate = req.params.id;

    try {
        const clientBeforeUpdate = await Client.findById(clientIdToUpdate);
        if (!clientBeforeUpdate) {
            return res.status(404).json({ 
                success: false, 
                message: 'Client not found, cannot update.' 
            });
        }

        const allowedUpdates = ['fullName', 'phone'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                const trimmedValue = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
                if (trimmedValue !== clientBeforeUpdate[field]) {
                    updates[field] = trimmedValue;
                }
            }
        });

        if (req.body.password) {
            if (req.body.password.length < 6) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'New password must be at least 6 characters.' 
                });
            }
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(req.body.password, salt);
        }

        let oldPhotoDbPath = null;
        if (req.file) {
            if (clientBeforeUpdate.profilePhoto && 
                clientBeforeUpdate.profilePhoto !== 'default.jpg' && 
                !clientBeforeUpdate.profilePhoto.startsWith('http')) {
                oldPhotoDbPath = clientBeforeUpdate.profilePhoto;
            }
            updates.profilePhoto = `/uploads/profiles/${req.file.filename}`;
        }

        if (Object.keys(updates).length === 0) {
            const currentClientData = clientBeforeUpdate.toObject();
            delete currentClientData.password;
            return res.status(200).json({ 
                success: true, 
                message: 'No changes applied.', 
                data: currentClientData 
            });
        }

        const updatedClient = await Client.findByIdAndUpdate(
            clientIdToUpdate, 
            { $set: updates }, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedClient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Client profile not found during update execution.' 
            });
        }

        if (oldPhotoDbPath) {
            const oldFileName = path.basename(oldPhotoDbPath);
            const diskPathForOldPhoto = path.join(__dirname, '..', 'uploads', 'profiles', oldFileName);
            if (fs.existsSync(diskPathForOldPhoto)) {
                try {
                    fs.unlinkSync(diskPathForOldPhoto);
                } catch (delErr) {
                    console.error(`Error deleting old profile photo: ${delErr.message}`);
                }
            }
        }

        res.status(200).json({ 
            success: true, 
            message: 'Profile updated successfully.', 
            data: updatedClient 
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = {};
            for (let field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ 
                success: false, 
                message: 'Validation Error', 
                errors 
            });
        }
        next(error); 
    }
};