// middleware/errorHandler.js
const ErrorResponse = require('../utils/errorResponse'); // Ensure this path is correct

const errorHandler = (err, req, res, next) => {
  // Log the original incoming error first for full context
  console.error('--- ERROR HANDLER CAUGHT ---');
  console.error('Original Error Object:', err); // Log the original error

  // Initialize error object based on the incoming error
  let error = { ...err }; // Spread properties
  error.message = err.message; // Ensure message is copied
  error.statusCode = err.statusCode || 500; // Default to 500

  // === Specific Error Handling ===

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    console.log('Error classified as: Mongoose CastError (Invalid ObjectId)');
    const message = `Resource not found. Invalid ID format for value: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    console.log('Error classified as: Mongoose Duplicate Key Error (11000)');
    let field = 'Field'; // Default field name
    if (err.keyValue) {
        try {
            field = Object.keys(err.keyValue)[0];
            field = field.charAt(0).toUpperCase() + field.slice(1); // Capitalize
        } catch (e) { console.error("Could not parse keyValue field name from duplicate key error", e); }
    }
    const value = err.keyValue ? Object.values(err.keyValue)[0] : 'provided value';
    const message = `${field} '${value}' already exists. Please use a different value.`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    console.log('Error classified as: Mongoose ValidationError');
    // Extract messages from Mongoose error object
    const messages = Object.values(err.errors).map(val => val.message);
    const message = `Validation Failed: ${messages.join('. ')}`;
    // Pass original Mongoose errors object for detailed client feedback in dev
    error = new ErrorResponse(message, 400, err.errors);
  }

  // JsonWebTokenError (invalid signature, malformed token, etc.)
  if (err.name === 'JsonWebTokenError') {
    console.log('Error classified as: JsonWebTokenError (Invalid Token)');
    const message = 'Session invalid or corrupted. Please log in again.';
    error = new ErrorResponse(message, 401);
  }

  // TokenExpiredError (JWT expired)
  if (err.name === 'TokenExpiredError') {
    console.log('Error classified as: TokenExpiredError (JWT Expired)');
    const message = 'Your session has expired. Please log in again.';
    error = new ErrorResponse(message, 401);
  }

  // Multer errors (file size, type etc.)
  if (err.code && typeof err.code === 'string' && err.code.startsWith('LIMIT_')) {
     console.log(`Error classified as: Multer Error (${err.code})`);
    // Provide clearer messages for common Multer errors
    let message = 'File upload error occurred.';
    if (err.code === 'LIMIT_FILE_SIZE') {
        message = `File is too large. Maximum size allowed is ${process.env.MAX_FILE_SIZE ? (parseInt(process.env.MAX_FILE_SIZE) / 1024 / 1024).toFixed(1) + 'MB' : 'not configured'}.`;
    } else if (err.code === 'LIMIT_FILE_COUNT') {
        message = 'Too many files uploaded.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        message = `Unexpected file field received: ${err.field}.`;
    } else {
        message = err.message || message; // Use Multer's message if available
    }
    error = new ErrorResponse(message, 400);
  }

   // Add handling for SyntaxError (e.g., invalid JSON payload)
   if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
       console.log('Error classified as: SyntaxError (Invalid JSON)');
       error = new ErrorResponse('Invalid request body format. Please ensure it is valid JSON.', 400);
   }


  // === Final Response Construction ===

  // Log the final error details being sent (useful for debugging 500s)
  console.error('--- ERROR HANDLER - FINAL RESPONSE ---');
  console.error(`Responding with Status Code: ${error.statusCode}`);
  console.error(`Responding with Error Message: ${error.message}`);
  // Log the stack trace of the *final* error object being sent
  if (error.stack) {
      console.error('Final Error Stack:');
      console.error(error.stack);
  }


  // Prepare response body
  const responseBody = {
    success: false,
    // In Production, use a generic message for 500 errors to avoid leaking details
    error: (error.statusCode === 500 && process.env.NODE_ENV === 'production')
            ? 'Internal Server Error'
            : error.message || 'Server Error',
  };

  // Conditionally add details ONLY in development environment
  if (process.env.NODE_ENV === 'development') {
      // Add specific validation errors if they exist on the final error object
      if (error.errors) {
          responseBody.errors = error.errors;
      }
      // Add stack trace if it exists
      if (error.stack) {
           // Use the stack from the final 'error' object, split into an array
           responseBody.stack = error.stack.split('\n').map(line => line.trim());
      } else if(err.stack) {
           // Fallback to original error stack if the final 'error' object lost it
           responseBody.stack = err.stack.split('\n').map(line => line.trim());
      }
  }

  res.status(error.statusCode).json(responseBody);
};

module.exports = errorHandler;