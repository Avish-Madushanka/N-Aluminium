// controllers/authController.js

// --- !!! WARNING !!! ---
// This file contains an INSECURE hardcoded admin login check for testing purposes.
// DO NOT use this in production. Remove the hardcoded check and manage admins
// via the database with hashed passwords.
// --- !!! WARNING !!! ---

const Client = require('../models/clientModel');
const BusinessOwner = require('../models/bOwnerModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (payload) => {
  return jwt.sign(
    payload,
    config.jwtSecret,
    { expiresIn: config.jwtExpire }
  );
};

exports.unifiedLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // --- !!! INSECURE HARDCODED ADMIN CHECK - TESTING ONLY !!! ---
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      console.warn('--- WARNING: Hardcoded admin login successful! ---'); // Keep this warning

      const adminPayload = {
        id: 'hardcoded-admin-001',
        role: 'admin',
        userType: 'bowner',
        name: 'System Admin',
        email: 'admin@gmail.com',
        businessName: 'Admin Control Panel',
        profilePhoto: '',
        coverPhoto: '',
        contactNumber: 'N/A',
      };
      const token = generateToken(adminPayload);
      const responseData = { ...adminPayload, _id: adminPayload.id };

      return res.status(200).json({
          success: true,
          message: `Login successful as hardcoded admin`,
          token: token,
          data: responseData
      });
      // --- END OF HARDCODED ADMIN BLOCK ---
    }

    // --- Database User Lookup ---
    let user = await Client.findOne({ email }).select('+password');
    let userType = 'client';
    let userRole = 'client';

    if (!user) {
      user = await BusinessOwner.findOne({ email }).select('+password');
      if (user) {
        userType = 'bowner';
        userRole = user.role || 'bowner';
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Prepare Payload for Database User JWT
    const tokenPayload = {
        id: user._id,
        role: userRole,
        userType: userType,
        name: userType === 'client' ? user.name : user.ownerName,
        email: user.email,
        businessName: userType === 'bowner' ? user.businessName : undefined,
        profilePhoto: user.profilePhoto,
        coverPhoto: user.coverPhoto,
        contactNumber: user.contactNumber,
    };

    const token = generateToken(tokenPayload);

    // Prepare Response Data (Database User)
    const userData = user.toObject();
    delete userData.password;
    const responseData = { ...userData, userType: userType, role: userRole };

    res.status(200).json({
        success: true,
        message: `Login successful as ${userType}`,
        token: token,
        data: responseData
    });

  } catch (error) {
    console.error("--- Unified Login Error ---", error);
    next(error);
  }
};

exports.logoutClient = async (req, res) => {
     try {
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