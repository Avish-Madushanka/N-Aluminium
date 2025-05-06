// controllers/authController.js (BACKEND - ADD LOGS)
const Client = require('../models/Client');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const config = require('../config/config'); // Ensure config is imported if needed directly

exports.login = asyncHandler(async (req, res, next) => {
  console.log("--- BACKEND: /api/auth/login ---"); // Log endpoint hit
  const { email, password } = req.body;
  console.log(`Login attempt for email: ${email}`);

  if (!email || !password) {
    console.log("Login failed: Missing email or password.");
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  let client;
  try {
    console.log(`Attempting to find client with email: ${email}`);
    // Crucially request the password field which is select: false by default
    client = await Client.findOne({ email }).select('+password');
    console.log("Client find result:", client ? `Found client ID: ${client._id}` : "Client not found");
  } catch (dbError) {
    console.error("Database error during Client.findOne:", dbError);
    // Pass the database error to the central error handler
    return next(dbError); // This will likely result in a 500 response via errorHandler
  }

  if (!client) {
    console.log("Login failed: Client not found in DB.");
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  let isMatch;
  try {
    console.log(`Comparing provided password with hash for client: ${client._id}`);
    isMatch = await client.matchPassword(password);
    console.log("Password match result:", isMatch);
  } catch (compareError) {
      console.error(`Error during password comparison for client ${client._id}:`, compareError);
      return next(compareError); // Pass bcrypt error to central handler -> 500
  }

  if (!isMatch) {
    console.log("Login failed: Password does not match.");
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  let token;
  try {
    console.log(`Attempting to generate JWT for client: ${client._id}`);
    // Log the secret being used (MASK partially in real production logs)
    console.log(`Using JWT_SECRET: ${config.JWT_SECRET ? config.JWT_SECRET.substring(0, 5) + '...' : 'UNDEFINED!'}`);
    console.log(`Using JWT_EXPIRE: ${config.JWT_EXPIRE || 'default'}`);
    token = client.getSignedJwtToken(); // This method uses JWT_SECRET internally
    console.log("JWT generated successfully.");
  } catch (jwtError) {
      console.error(`Error generating JWT for client ${client._id}:`, jwtError);
      // It's crucial that getSignedJwtToken handles missing secret internally or this catch works
      return next(jwtError); // Pass JWT error to central handler -> 500
  }


  // If code reaches here, everything succeeded
  console.log(`Login successful for client: ${client._id}`);
  res.status(200).json({
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

exports.getMe = asyncHandler(async (req, res, next) => {
    // ... (getMe code remains the same)
    const client = await Client.findById(req.client.id);
    if (!client) {
        return next(new ErrorResponse(`Client not found with id ${req.client.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: {
            id: client._id, name: client.name, email: client.email,
            contactNumber: client.contactNumber, address: client.address,
            district: client.district, province: client.province,
            profilePhoto: client.profilePhoto, role: client.role,
            createdAt: client.createdAt
        },
    });
});