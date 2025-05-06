// controllers/authController.js
const Client = require('../models/Client');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Login client
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for client
  const client = await Client.findOne({ email }).select('+password');
  if (!client) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await client.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Create token
  const token = client.getSignedJwtToken();

  // Options for cookie (example - adjust as needed)
  const options = {
    expires: new Date(Date.now() + (parseInt(config.JWT_EXPIRE) || 30) * 24 * 60 * 60 * 1000), // e.g. 30 days
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true; // Only send cookie over HTTPS
    options.sameSite = 'None'; // If frontend and backend are on different domains
  }


  res.status(200)
    // .cookie('token', token, options) // Optional: send token in a cookie
    .json({
      success: true,
      token,
      data: {
        id: client._id,
        name: client.name,
        email: client.email,
        profilePhoto: client.profilePhoto,
        role: client.role,
      },
    });
});

// @desc    Get current logged in client
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // req.client is populated by the 'protect' middleware
  const client = await Client.findById(req.client.id);

  if (!client) {
    return next(new ErrorResponse(`Client not found with id ${req.client.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: { // Send back only necessary, non-sensitive data
        id: client._id,
        name: client.name,
        email: client.email,
        contactNumber: client.contactNumber,
        address: client.address,
        district: client.district,
        province: client.province,
        profilePhoto: client.profilePhoto,
        role: client.role,
        createdAt: client.createdAt
    },
  });
});