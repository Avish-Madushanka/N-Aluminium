// backend/server.js
require('dotenv').config(); // MUST BE FIRST
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Import http

// --- Import Routes ---
const clientRoutes = require('./routes/clientRoutes');
const bOwnerRoutes = require('./routes/bOwnerRoutes');
const authRoutes = require('./routes/authRoutes');
const calendarSettingsRoutes = require('./routes/calendarSettingsRoutes');

// --- Import Controllers/Middleware ---
const { createInitialAdmin } = require('./controllers/adminController'); // Ensure this path is correct
const errorHandler = require('./middleware/errorHandler');             // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 5003;

// --- Core Middleware ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Your React frontend URL
    credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for potential image data in JSON (if ever needed)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(`[Server Config] Serving static files from ${path.join(__dirname, 'uploads')} at /uploads`);

// --- API Routes Mounting ---
app.get('/', (req, res) => { res.status(200).json({ status: 'ok', message: 'Backend API is running.' }); });
console.log(`[Server Config] Mounting /api/auth routes...`);
app.use('/api/auth', authRoutes);
console.log(`[Server Config] Mounting /api/clients routes...`);
app.use('/api/clients', clientRoutes);
console.log(`[Server Config] Mounting /api/b-owners routes...`); // Corrected log to match path
app.use('/api/b-owners', bOwnerRoutes); // Path uses hyphen
console.log(`[Server Config] Mounting /api/calendar-settings routes...`);
app.use('/api/calendar-settings', calendarSettingsRoutes);

// --- Global Error Handler (MUST BE LAST) ---
console.log('[Server Config] Adding global error handler.');
app.use(errorHandler);

// --- Database Connection & Server Start ---
const server = http.createServer(app); // Create HTTP server

console.log('[DB Connection] Attempting connection...');
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('[DB Connection] MongoDB Connected.');
        server.listen(PORT, async () => { // Use server.listen
            console.log(`[Server Startup] Server listening on http://localhost:${PORT}`);
            try {
                await createInitialAdmin(); // Call and await
            } catch (adminError) {
                console.error("[Server Startup] Error during initial admin creation:", adminError);
                // Decide if this is fatal. For now, just log it.
            }
            console.log('[Server Startup] Ready.');
        });
    })
    .catch(err => {
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('[DB Connection] CRITICAL FAILURE:', err.message);
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        process.exit(1);
    });

// --- Global Error Handlers for Node Process ---
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${err.message}`);
  console.error(err.stack);
  // Close server & exit process
  server.close(() => {
      console.error('Server closed due to Unhandled Rejection');
      process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  // Close server & exit process
  server.close(() => {
      console.error('Server closed due to Uncaught Exception');
      process.exit(1);
  });
});