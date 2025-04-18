const Client = require('../models/clientModel');
const BusinessOwner = require('../models/bOwnerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });
};

exports.unifiedLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) { return res.status(400).json({ success: false, message: 'Please provide both email and password' }); }

    let user = await Client.findOne({ email }).select('+password');
    let userType = 'client';

    if (!user) {
        user = await BusinessOwner.findOne({ email }).select('+password');
        userType = 'bowner';
    }

    if (!user) { return res.status(401).json({ success: false, message: 'Invalid email or password' }); }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { return res.status(401).json({ success: false, message: 'Invalid email or password' }); }

    const token = generateToken(user._id);
    const userData = user.toObject();
    delete userData.password;

    let responseData;
    if (userType === 'client') {
        responseData = { ...userData, userType: 'client' };
    } else {
        responseData = { ...userData, userType: 'bowner' };
    }

    res.status(200).json({ success: true, message: `Login successful as ${userType}`, token: token, data: responseData });

  } catch (error) {
    console.error("Unified Login Error:", error);
    res.status(500).json({ success: false, message: 'An unexpected server error occurred during login.' });
  }
};

exports.logoutClient = async (req, res) => {
     try { res.status(200).json({ success: true, message: 'Logout successful. Clear token client-side.' }); }
     catch (error) { console.error("Client Logout Error:", error); res.status(500).json({ success: false, message: 'Server error during logout.' }); }
};

exports.logoutBOwner = async (req, res) => {
     try { res.status(200).json({ success: true, message: 'Logout successful. Clear token client-side.' }); }
     catch (error) { console.error("BOwner Logout Error:", error); res.status(500).json({ success: false, message: 'Server error during logout.' }); }
};