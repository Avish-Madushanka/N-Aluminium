// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const connectDB = require('./db');

// --- Connect to Database ---
connectDB();

// --- Route Imports ---
// Ensure these paths are correct relative to server.js
const clientRoutes = require('./routes/clientRoutes');
const authRoutes = require('./routes/authRoutes');
const bOwnerRoutes = require('./routes/bOwnerRoutes');
const saleItemRoutes = require('./routes/saleItemRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const materialRoutes = require('./routes/materialRoutes');

// --- Initialize Express App ---
const app = express();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
// Mount routes BEFORE the general 404 handler
app.use('/api/auth', authRoutes); // Handles /api/auth/login, /api/auth/client/logout, etc.
app.use('/api/clients', clientRoutes);
app.use('/api/bowners', bOwnerRoutes);
app.use('/api/saleitems', saleItemRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/materials', materialRoutes);

// --- Simple Root Route ---
app.get('/', (req, res) => {
  res.status(200).send(`API running (${config.nodeEnv})`);
});

// --- 404 Handler for API routes ---
// This catches any /api/* request that didn't match the routes above
app.use('/api/*', (req, res, next) => {
  res.status(404).json({ success: false, message: `API endpoint not found at ${req.originalUrl}` });
});

// --- Global Error Handling Middleware ---
// Must be the LAST middleware applied
app.use((err, req, res, next) => {
    console.error("--- Global Error Handler Caught ---");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Route:", req.method, req.originalUrl);
    console.error("Error Name:", err.name || "N/A");
    console.error("Error Message:", err.message || "No message");
    if (config.nodeEnv === 'development') {
       console.error("Error Stack:", err.stack || "No stack trace available");
    }

    if (res.headersSent) {
        console.error("Headers already sent, cannot send error response.");
        return next(err);
    }

    let statusCode = err.statusCode || 500;
    let message = err.message || 'An unexpected server error occurred.';

    // Specific Error Handling
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = `Validation Failed: ${Object.values(err.errors).map(val => val.message).join('. ')}`;
    } else if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value error: A record with this ${field} already exists.`;
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid data format for field '${err.path}'. Expected ${err.kind}.`;
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Authentication error: Invalid token.';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Authentication error: Token has expired.';
    }

    // Send JSON Error Response
    res.status(statusCode).json({
        success: false,
        message: message,
        errorType: config.nodeEnv !== 'production' ? err.name : undefined,
        stack: config.nodeEnv === 'development' ? err.stack : undefined
    });
});

module.exports = app; // Export the configured app