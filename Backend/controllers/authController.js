// controllers/authController.js

const Client = require('../models/clientModel');
const BusinessOwner = require('../models/bOwnerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config'); // Ensure path is correct

// --- UPDATED generateToken Function ---
// Now accepts a payload object containing user details
const generateToken = (payload) => {
  // Remove sensitive data like password before logging if necessary
  // const logPayload = { ...payload }; delete logPayload.password; // Example
  console.log("Generating token with payload:", payload);
  return jwt.sign(
    payload, // Sign the entire payload object
    config.jwtSecret,
    { expiresIn: config.jwtExpire } // Use expiry from config
  );
};

// --- Unified Login Function ---
exports.unifiedLogin = async (req, res, next) => { // Use next for error propagation
  const { email, password } = req.body;
  try {
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // --- Find User (Check Client first, then BusinessOwner) ---
    let user = await Client.findOne({ email }).select('+password'); // Include password for comparison
    let userType = 'client';
    let userRole = 'client'; // Default role for client

    if (!user) {
        // If not found as client, check as business owner
        user = await BusinessOwner.findOne({ email }).select('+password'); // Include password
        if (user) {
             // User found as BusinessOwner
             userType = 'bowner';
             // Determine role ('bowner' or 'admin') from the BusinessOwner model's role field
             userRole = user.role || 'bowner'; // Default to 'bowner' if role field is missing
        }
    }

    // If user is still not found after checking both models
    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' }); // 401 Unauthorized
    }

    // --- Verify Password ---
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Login attempt failed: Password mismatch for email ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid email or password' }); // 401 Unauthorized
    }

    // --- Prepare Payload for JWT ---
    // Include all necessary fields the frontend (App.jsx, Navbar.jsx, BOwnerHeader.jsx etc.) needs after decoding
    const tokenPayload = {
        id: user._id,               // User's MongoDB ID (crucial)
        role: userRole,             // 'client', 'bowner', or 'admin' (crucial for logic)
        userType: userType,         // 'client' or 'bowner' (crucial for logic)
        // Include the correct name field based on user type
        name: userType === 'client' ? user.name : user.ownerName,
        email: user.email,          // User's email
        // --- ADDED/ENSURED FIELDS for BOwnerHeader ---
        businessName: userType === 'bowner' ? user.businessName : undefined, // Include only if BOwner/Admin
        profilePhoto: user.profilePhoto, // The relative path saved in DB (e.g., /uploads/...)
        coverPhoto: user.coverPhoto,     // The relative path saved in DB (e.g., /uploads/...)
        contactNumber: user.contactNumber, // Include contact number
        // --- Add other small, frequently needed, non-sensitive fields if desired ---
    };

    // --- Generate Token with the prepared payload ---
    const token = generateToken(tokenPayload);

    // --- Prepare Response Data (for the immediate login response) ---
    // Convert Mongoose document to plain object
    const userData = user.toObject();
    // IMPORTANT: Remove password hash before sending user data back
    delete userData.password;

    // Add userType and role to the data part of the response as well, useful for frontend
    const responseData = { ...userData, userType: userType, role: userRole };

    console.log(`Login successful for ${email} as ${userType} (Role: ${userRole})`);

    // --- Send Success Response ---
    res.status(200).json({
        success: true,
        message: `Login successful as ${userType}`,
        token: token,       // The JWT containing the detailed payload
        data: responseData  // User data (without password) for immediate use by frontend after login
    });

  } catch (error) {
    // --- Error Handling ---
    console.error("--- Unified Login Error ---", error);
    // Pass error to the global error handler middleware in server.js
    next(error);
  }
};

// --- Logout Handlers (Backend doesn't invalidate JWTs, relies on client deleting token) ---
exports.logoutClient = async (req, res) => {
     try {
        // Backend doesn't technically do anything for logout with JWTs
        res.status(200).json({ success: true, message: 'Logout acknowledgement successful. Client should clear token.' });
     } catch (error) {
        console.error("Client Logout Endpoint Error:", error);
        res.status(500).json({ success: false, message: 'Server error during logout acknowledgement.' });
     }
};

exports.logoutBOwner = async (req, res) => {
     try {
        res.status(200).json({ success: true, message: 'Logout acknowledgement successful. Client should clear token.' });
     } catch (error) {
        console.error("BOwner Logout Endpoint Error:", error);
        res.status(500).json({ success: false, message: 'Server error during logout acknowledgement.' });
     }
};