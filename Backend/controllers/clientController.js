// controllers/clientController.js (BACKEND)
const Client = require('../models/Client');
const { validateRegistration } = require('../utils/validators');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Register client
// @route   POST /api/clients/register
// @access  Public
exports.registerClient = asyncHandler(async (req, res, next) => {
  console.log('--- BACKEND: /api/clients/register ---');
  console.log('Request Body Received by Controller:', JSON.stringify(req.body, null, 2));
  console.log('Request File Received by Controller:', req.file);

  // Destructure expected fields from req.body; confirmPassword is no longer expected
  const { name, email, contactNumber, password, address, district, province } = req.body;

  console.log("--- BACKEND: Calling validateRegistration ---");
  // Pass only the relevant fields to the validator
  const validationInput = { name, email, contactNumber, password, address, district, province };
  console.log("Data being passed to validateRegistration:", JSON.stringify(validationInput, null, 2));
  const { errors: validationErrorsObject, isValid } = validateRegistration(validationInput);

  if (!isValid) {
    console.error("--- BACKEND: validateRegistration FAILED ---");
    console.error("Validation errors object from validator:", JSON.stringify(validationErrorsObject, null, 2));
    return next(new ErrorResponse('Validation failed. Please check your input.', 400, validationErrorsObject));
  }
  console.log("--- BACKEND: validateRegistration PASSED ---");

  const existingClient = await Client.findOne({ email: email.toLowerCase().trim() });
  if (existingClient) {
    console.warn(`--- BACKEND: Client with email ${email} already exists. ---`);
    return next(new ErrorResponse('Client already exists with this email', 400));
  }

  console.log("--- BACKEND: Proceeding to Client.create ---");
  const client = await Client.create({
    name, email, contactNumber, password, address, district, province,
    profilePhoto: req.file ? req.file.filename : 'default.jpg',
  });
  console.log(`--- BACKEND: Client created successfully: ${client._id} ---`);

  const token = client.getSignedJwtToken();

  res.status(201).json({
    success: true,
    token,
    data: {
      id: client._id, name: client.name, email: client.email,
      profilePhoto: client.profilePhoto, role: client.role,
    },
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.client.id).select('-password');
  if (!client) {
    return next(new ErrorResponse(`Client not found with id ${req.client.id}`, 404));
  }
  res.status(200).json({
    success: true,
    data: client,
  });
});