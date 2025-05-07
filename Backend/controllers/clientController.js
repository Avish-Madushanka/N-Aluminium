const Client = require('../models/Client');

exports.registerClient = async (req, res, next) => {
    try {
        const { name, email, contactNumber, password, address, district, province } = req.body;

        if (!name || !email || !contactNumber || !password || !address || !district || !province) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const newClient = new Client({
            name, email, contactNumber, password, address, district, province
        });

        if (req.file) {
            newClient.profilePhoto = `/uploads/${req.file.filename}`;
        }

        await newClient.save();
        // Don't send back the full user object, especially password related fields
        const clientResponse = { ...newClient._doc };
        delete clientResponse.password;

        res.status(201).json({
            success: true,
            message: 'Client registered successfully.',
            data: { clientId: newClient._id, name: newClient.name, email: newClient.email }
        });
    } catch (error) {
        next(error);
    }
};