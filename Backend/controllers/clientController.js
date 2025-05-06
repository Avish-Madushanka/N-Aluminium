// controllers/clientController.js
const Client = require('../models/Client');
const { validateRegistration } = require('../utils/validators'); // Ensure this path is correct
const ErrorResponse = require('../utils/errorResponse');       // Ensure this path is correct
const asyncHandler = require('../middleware/async');           // Ensure this path is correct
const path = require('path');
const fs = require('fs');

// @desc    Register client
// @route   POST /api/clients/register
// @access  Public
exports.registerClient = asyncHandler(async (req, res, next) => {
  console.log('--- REGISTER CLIENT REQUEST ---');
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);

  const { name, email, contactNumber, password, confirmPassword, address, district, province } = req.body;

  // Validate input using the custom validator
  const { errors, isValid } = validateRegistration({ name, email, contactNumber, password, confirmPassword, address, district, province });
  if (!isValid) {
    // If using ErrorResponse with an errors object:
    return next(new ErrorResponse('Validation failed. Please check your input.', 400, errors));
  }

  // Check if client exists
  const existingClient = await Client.findOne({ email });
  if (existingClient) {
    return next(new ErrorResponse('Client already exists with this email', 400));
  }

  // Create client
  // Mongoose will also run its schema validations here (e.g., required fields, enums)
  const client = await Client.create({
    name,
    email,
    contactNumber,
    password, // Password will be hashed by the pre-save hook in Client model
    address,
    district,
    province,
    profilePhoto: req.file ? req.file.filename : 'default.jpg',
  });

  // Create token
  const token = client.getSignedJwtToken();

  res.status(201).json({
    success: true,
    token,
    data: { // Return only necessary, non-sensitive data
      id: client._id,
      name: client.name,
      email: client.email,
      profilePhoto: client.profilePhoto,
      role: client.role,
    },
  });
});

// @desc    Get current logged in client profile (alternative to /api/auth/me if needed)
// @route   GET /api/clients/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.client is populated by the 'protect' middleware
  const client = await Client.findById(req.client.id).select('-password'); // Exclude password

  if (!client) {
    return next(new ErrorResponse(`Client not found with id ${req.client.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: client, // Or pick specific fields like in authController's getMe
  });
});


// Example: Delete Photo Utility (if you need it, not used in registerClient directly for old photos)
// This would be used in an "update profile" scenario usually.
const deletePhotoFromServer = (photoFilename) => {
  if (!photoFilename || photoFilename === 'default.jpg') {
    return; // Do nothing if no photo or it's the default
  }
  const photoPath = path.join(__dirname, '..', 'uploads', photoFilename); // Adjust path as per your uploads folder structure

  fs.access(photoPath, fs.constants.F_OK, (err) => {
    if (err) {
      // console.warn(`Photo file not found, cannot delete: ${photoPath}`);
      return;
    }
    fs.unlink(photoPath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(`Error deleting photo file ${photoPath}:`, unlinkErr);
      } else {
        console.log(`Successfully deleted photo file: ${photoPath}`);
      }
    });
  });
};