// --- START OF UPDATED controllers/authController.js ---
const Client = require('../models/clientModel');
const BusinessOwner = require('../models/bOwnerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  });
};

// Keep old specific logins if needed for other purposes, or remove them
exports.loginClient = async (req, res) => { /* ... existing code ... */ };
exports.loginBOwner = async (req, res) => { /* ... existing code ... */ };
exports.logoutClient = async (req, res) => { /* ... existing code ... */ };
exports.logoutBOwner = async (req, res) => { /* ... existing code ... */ };

// --- NEW Unified Login Function ---
exports.unifiedLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Validate input
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // --- Attempt to find as Client ---
    let user = await Client.findOne({ email }).select('+password');
    let userType = 'client';

    // --- If not found as Client, attempt to find as Business Owner ---
    if (!user) {
        user = await BusinessOwner.findOne({ email }).select('+password');
        userType = 'bowner';
    }

    // --- If not found as either type ---
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // --- Check Password ---
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        // Password doesn't match the found user (regardless of type)
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // --- User Found and Password Matches ---

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Prepare response data based on the determined userType
    let responseData;
    const userData = user.toObject(); // Convert Mongoose doc to plain object
    delete userData.password;       // IMPORTANT: Remove password hash

    if (userType === 'client') {
        responseData = {
            id: userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role || 'client',
            userType: 'client' // Explicitly add userType
            // Add other client-specific fields if needed
        };
    } else { // userType === 'bowner'
        responseData = {
            id: userData._id,
            businessName: userData.businessName,
            ownerName: userData.ownerName,
            email: userData.email,
            role: userData.role || 'bowner',
            userType: 'bowner', // Explicitly add userType
            profilePhoto: userData.profilePhoto,
            coverPhoto: userData.coverPhoto
            // Add other bowner-specific fields if needed
        };
    }

    // 6. Send successful response
    res.status(200).json({
      success: true,
      message: `Login successful as ${userType}`,
      token: token,
      data: responseData // Contains user details and userType
    });

  } catch (error) {
    console.error("Unified Login Error:", error);
    res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred during login.',
    });
  }
};

// --- END OF UPDATED controllers/authController.js ---