// controllers/authController.js

const Client = require('../models/clientModel');
const BusinessOwner = require('../models/bOwnerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config'); // Ensure path is correct

// --- UPDATED generateToken Function ---
// Accepts a payload object containing user details
const generateToken = (payload) => {
  console.log("Generating token with payload:", payload); // Log payload for debugging
  return jwt.sign(
    payload, // Sign the entire payload object
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

exports.unifiedLogin = async (req, res, next) => { // Added next for error handling
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    let user = await Client.findOne({ email }).select('+password');
    let userType = 'client';
    let userRole = 'client'; // Default role for client

    if (!user) {
        // User not found as Client, try finding as BusinessOwner
        user = await BusinessOwner.findOne({ email }).select('+password');
        if (user) {
             // User found as BusinessOwner
             userType = 'bowner';
             // Determine role ('bowner' or 'admin') from the BusinessOwner model
             userRole = user.role || 'bowner';
        }
    }

    // If user is still not found after checking both models
    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login attempt failed: Password mismatch for email ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // --- Prepare Payload for JWT ---
    // Include all necessary fields the frontend needs after decoding
    const tokenPayload = {
        id: user._id,               // User's MongoDB ID
        role: userRole,             // 'client', 'bowner', or 'admin'
        userType: userType,         // 'client' or 'bowner'
        // Include the correct name field based on user type
        name: userType === 'client' ? user.name : user.ownerName,
        email: user.email,
        // Optionally include businessName for bowners/admins if needed in frontend state
        businessName: userType === 'bowner' ? user.businessName : undefined,
    };

    // --- Generate Token with the full payload ---
    const token = generateToken(tokenPayload);

    // --- Prepare Response Data ---
    // Get user data without the password hash
    const userData = user.toObject();
    delete userData.password;

    // Add userType and role to the data part of the response (useful for immediate frontend use)
    const responseData = { ...userData, userType: userType, role: userRole };

    console.log(`Login successful for ${email} as ${userType} (Role: ${userRole})`);

    // --- Send Success Response ---
    res.status(200).json({
        success: true,
        message: `Login successful as ${userType}`,
        token: token,       // The JWT containing the detailed payload
        data: responseData  // User data (without password) for immediate use
    });

  } catch (error) {
    console.error("--- Unified Login Error ---", error);
    // Pass error to the global error handler in server.js
    next(error);
  }
};

// --- Logout handlers remain the same ---
exports.logoutClient = async (req, res) => {
     try { res.status(200).json({ success: true, message: 'Logout successful. Clear token client-side.' }); }
     catch (error) { console.error("Client Logout Error:", error); res.status(500).json({ success: false, message: 'Server error during logout.' }); }
};

exports.logoutBOwner = async (req, res) => {
     try { res.status(200).json({ success: true, message: 'Logout successful. Clear token client-side.' }); }
     catch (error) { console.error("BOwner Logout Error:", error); res.status(500).json({ success: false, message: 'Server error during logout.' }); }
};