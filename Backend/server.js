// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config'); // Loads .env
const connectDB = require('./db');

// --- Connect to Database ---
connectDB();

// --- Route Imports ---
const clientRoutes = require('./routes/clientRoutes');
const authRoutes = require('./routes/authRoutes');
const bOwnerRoutes = require('./routes/bOwnerRoutes');
const saleItemRoutes = require('./routes/saleItemRoutes');
// New Routes for Scheduler
const bookingRoutes = require('./routes/bookingRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const materialRoutes = require('./routes/materialRoutes');

// --- Initialize Express App ---
const app = express();

// --- Core Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from uploads

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/bowners', bOwnerRoutes);
app.use('/api/saleitems', saleItemRoutes);
// Scheduler Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/materials', materialRoutes);

// --- Simple Root Route ---
app.get('/', (req, res) => {
  res.status(200).send(`API running (${config.nodeEnv})`);
});

// --- 404 Handler for API routes ---
// This should be after all your API routes
app.use('/api/*', (req, res, next) => {
  res.status(404).json({ success: false, message: `API endpoint not found at ${req.originalUrl}` });
});

// --- Global Error Handling Middleware ---
// This should be the LAST piece of middleware
app.use((err, req, res, next) => {
    console.error("--- Global Error Handler Caught ---");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Route:", req.method, req.originalUrl);
    console.error("Error Name:", err.name || "N/A");
    console.error("Error Message:", err.message || "No message");
    // Log stack trace only in development for clarity, or always for detailed debugging
    if (config.nodeEnv === 'development' || !res.headersSent) { // Avoid logging stack if response already sent
       console.error("Error Stack:", err.stack || "No stack trace available");
    }

    // Prevent sending response if headers already sent (e.g., by a stream error)
    if (res.headersSent) {
        console.error("Headers already sent, cannot send error response.");
        return next(err); // Pass to default Express handler
    }

    let statusCode = err.statusCode || 500; // Default to 500 Internal Server Error
    let message = err.message || 'An unexpected server error occurred.';

    // --- Specific Error Handling ---
    if (err.name === 'ValidationError') {
        statusCode = 400; // Bad Request
        // Consolidate validation messages
        message = `Validation Failed: ${Object.values(err.errors).map(val => val.message).join('. ')}`;
    } else if (err.code === 11000) { // Mongoose duplicate key error
        statusCode = 400; // Bad Request
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value error: A record with this ${field} already exists.`;
    } else if (err.name === 'CastError') {
        statusCode = 400; // Bad Request
        message = `Invalid data format for field '${err.path}'. Expected ${err.kind}.`;
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401; // Unauthorized
        message = 'Authentication error: Invalid token.';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401; // Unauthorized
        message = 'Authentication error: Token has expired.';
    }
     // Add more specific error types as needed

    // --- Send JSON Error Response ---
    res.status(statusCode).json({
        success: false,
        message: message,
        // Optionally include error name or code in non-production for easier debugging
        errorType: config.nodeEnv !== 'production' ? err.name : undefined,
        // DO NOT send stack trace in production
        stack: config.nodeEnv === 'development' ? err.stack : undefined
    });
});

module.exports = app; // Export the configured app