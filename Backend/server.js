// backend/server.js
require('dotenv').config(); // MUST BE FIRST
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');

// Import the connectDB function
// Adjust the path if your db.js is in a different location (e.g., './db' if in the same folder)
const connectDB = require('./config/db');

// --- Import Routes ---
const clientRoutes = require('./routes/clientRoutes');
const bOwnerRoutes = require('./routes/bOwnerRoutes');
const authRoutes = require('./routes/authRoutes');
const calendarSettingsRoutes = require('./routes/calendarSettingsRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const scrapTypeRoutes = require('./routes/scrapTypeRoutes');
const collectorRoutes = require('./routes/collectorRoutes');

// --- Import Controllers/Middleware ---
const { createInitialAdmin } = require('./controllers/adminController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5003;

// --- Core Middleware ---
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log(`[Server Config] Serving static files from ${path.join(__dirname, 'uploads')} at /uploads`);


// --- API Routes Mounting ---
app.get('/', (req, res) => { res.status(200).json({ status: 'ok', message: 'Backend API is running.' }); });

const mountRoutes = () => {
    console.log(`[Server Config] Mounting /api/auth routes...`);
    app.use('/api/auth', authRoutes);
    console.log(`[Server Config] Mounting /api/clients routes...`);
    app.use('/api/clients', clientRoutes);
    console.log(`[Server Config] Mounting /api/b-owners routes...`);
    app.use('/api/b-owners', bOwnerRoutes);
    console.log(`[Server Config] Mounting /api/calendar-settings routes...`);
    app.use('/api/calendar-settings', calendarSettingsRoutes);
    if (bookingRoutes) {
        console.log(`[Server Config] Mounting /api/bookings routes...`);
        app.use('/api/bookings', bookingRoutes);
    }
    if (reviewRoutes) {
        console.log(`[Server Config] Mounting /api/reviews routes...`);
        app.use('/api/reviews', reviewRoutes);
    }
    if (scrapTypeRoutes) {
        console.log(`[Server Config] Mounting /api/scrap-types routes...`);
        app.use('/api/scrap-types', scrapTypeRoutes);
    }
    if (collectorRoutes) {
        console.log(`[Server Config] Mounting /api/collectors routes...`);
        app.use('/api/collectors', collectorRoutes);
    }
    console.log('[Server Config] All routes mounted.');
};

mountRoutes(); // Call the function to mount all routes

// --- Global Error Handler (MUST BE LAST middleware before listen) ---
console.log('[Server Config] Adding global error handler.');
app.use(errorHandler);

// --- HTTP Server ---
const server = http.createServer(app);

// --- Start Server Function ---
const startServer = async () => {
    try {
        // Connect to Database
        await connectDB(); // This now handles all Mongoose connection logic

        // Start listening for requests
        server.listen(PORT, async () => {
            console.log(`[Server Startup] Server listening on http://localhost:${PORT}`);
            // Create initial admin after server is listening and DB is connected
            try {
                await createInitialAdmin();
            } catch (adminError) {
                console.error("[Server Startup] Error during initial admin creation:", adminError);
            }
            console.log('[Server Startup] Application ready.');
        });
    } catch (error) {
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('[Server Startup] CRITICAL FAILURE TO START SERVER:', error.message);
        if (process.env.NODE_ENV === 'development') {
            console.error(error);
        }
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        process.exit(1); // Exit if DB connection fails from connectDB or other critical startup error
    }
};

// --- Global Unhandled Error Handlers for Node Process ---
// (These should ideally be outside startServer, as they are process-level)
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${err.message}`);
  console.error(err.stack);
  // Gracefully shutdown the server if it's running
  if (server && server.listening) {
    server.close(() => {
      console.error('Server closed due to Unhandled Rejection.');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  if (server && server.listening) {
    server.close(() => {
      console.error('Server closed due to Uncaught Exception.');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});


// --- Initiate Server Start ---
startServer();