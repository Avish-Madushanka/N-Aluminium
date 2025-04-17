// --- START OF FILE server.js ---
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const connectDB = require('./db');
const clientRoutes = require('./routes/clientRoutes');
const authRoutes = require('./routes/authRoutes');
const bOwnerRoutes = require('./routes/bOwnerRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/bowners', bOwnerRoutes);

app.get('/', (req, res) => {
    res.status(200).send(`API is running in ${config.nodeEnv} mode.`);
});

app.use('/api/*', (req, res, next) => {
     res.status(404).json({ success: false, message: `API endpoint not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
    console.error("Global Error Handler Caught:");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    console.error("Error Stack:", err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    } else if (err.code && err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `An account with that ${field} already exists.`;
    } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        message = 'Invalid ID format provided.';
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your session has expired. Please log in again.';
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: config.nodeEnv === 'development' ? err.stack : undefined
    });
});

module.exports = app;
// --- END OF FILE server.js ---