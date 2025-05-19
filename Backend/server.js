// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = 'path'; // Error: should be require('path')
const actualHttp = require('http'); // Corrected
const fs = require('fs');

const connectDB = require('./config/db');

// --- Import Routes ---
console.log('[Server Startup] Attempting to load routes...');
let clientRoutes, bOwnerRoutes, authRoutes, calendarSettingsRoutes, bookingRoutes, reviewRoutes, scrapTypeRoutes, shopLocationRoutes;

try {
    clientRoutes = require('./routes/clientRoutes');
    console.log('[Server Startup] clientRoutes loaded successfully.');
} catch (e) { console.error('[Server Startup] FAILED to load clientRoutes:', e.message); }

try {
    bOwnerRoutes = require('./routes/bOwnerRoutes');
    console.log('[Server Startup] bOwnerRoutes loaded successfully.');
} catch (e) { console.error('[Server Startup] FAILED to load bOwnerRoutes:', e.message); }

try {
    authRoutes = require('./routes/authRoutes');
    console.log('[Server Startup] authRoutes loaded successfully.');
} catch (e) { console.error('[Server Startup] FAILED to load authRoutes:', e.message); }

try {
    calendarSettingsRoutes = require('./routes/calendarSettingsRoutes');
    console.log('[Server Startup] calendarSettingsRoutes loaded successfully.');
} catch (e) { console.error('[Server Startup] FAILED to load calendarSettingsRoutes:', e.message); }

try {
    bookingRoutes = require('./routes/bookingRoutes');
    console.log('[Server Startup] bookingRoutes loaded successfully.');
} catch (e) { console.error('[Server Startup] FAILED to load bookingRoutes:', e.message); }

try {
    reviewRoutes = require('./routes/reviewRoutes');
    console.log('[Server Startup] reviewRoutes loaded successfully.');
} catch (e) { console.error('[Server Startup] FAILED to load reviewRoutes:', e.message); }

try {
    scrapTypeRoutes = require('./routes/scrapTypeRoutes');
    console.log('[Server Startup] scrapTypeRoutes loaded successfully.');
} catch (e) { console.error('[Server Startup] FAILED to load scrapTypeRoutes:', e.message); }

try {
    shopLocationRoutes = require('./routes/shopLocationRoutes'); // <<< Key import
    console.log('[Server Startup] shopLocationRoutes loaded successfully. Type:', typeof shopLocationRoutes);
    if (typeof shopLocationRoutes !== 'function' && typeof shopLocationRoutes.stack !== 'object') {
        console.warn('[Server Startup] shopLocationRoutes loaded, but it does not look like an Express router. Check its module.exports.');
    }
} catch (e) {
    console.error('[Server Startup] CRITICAL: FAILED to load shopLocationRoutes:', e.message, e.stack);
    shopLocationRoutes = null; // Ensure it's null if failed
}


// --- Import Controllers/Middleware ---
const { createInitialAdmin } = require('./controllers/adminController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const actualPath = require('path'); // Corrected the path import
app.use('/uploads', express.static(actualPath.join(__dirname, 'uploads')));
if (fs.existsSync(actualPath.join(__dirname, 'uploads'))) {
    console.log(`[Server Config] Serving static files from ${actualPath.join(__dirname, 'uploads')} at /uploads`);
} else {
    console.warn(`[Server Config] 'uploads' directory does not exist. Static file serving for /uploads might not work as expected.`);
}

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend API is running.' });
});

const mountRoutes = () => {
    console.log('[Server Config] Starting route mounting process...');
    if (authRoutes) { app.use('/api/auth', authRoutes); console.log('[Server Config] /api/auth mounted.'); }
    if (clientRoutes) { app.use('/api/clients', clientRoutes); console.log('[Server Config] /api/clients mounted.'); }
    if (bOwnerRoutes) { app.use('/api/b-owners', bOwnerRoutes); console.log('[Server Config] /api/b-owners mounted.'); }
    if (calendarSettingsRoutes) { app.use('/api/calendar-settings', calendarSettingsRoutes); console.log('[Server Config] /api/calendar-settings mounted.'); }
    if (bookingRoutes) { app.use('/api/bookings', bookingRoutes); console.log('[Server Config] /api/bookings mounted.'); }
    if (reviewRoutes) { app.use('/api/reviews', reviewRoutes); console.log('[Server Config] /api/reviews mounted.'); }
    if (scrapTypeRoutes) { app.use('/api/scrap-types', scrapTypeRoutes); console.log('[Server Config] /api/scrap-types mounted.'); }

    // --- Shop Locations Mounting ---
    if (shopLocationRoutes && (typeof shopLocationRoutes === 'function' || typeof shopLocationRoutes.stack === 'object')) {
        app.use('/api/shop-locations', shopLocationRoutes);
        console.log(`[Server Config] SUCCESS: /api/shop-locations routes mounted.`);
    } else {
        console.error(`[Server Config] ERROR: shopLocationRoutes was NOT mounted. It's either undefined, null, or not an Express router.`);
        console.error(`[Server Config] Current value of shopLocationRoutes:`, shopLocationRoutes);
        console.error(`[Server Config] Type of shopLocationRoutes:`, typeof shopLocationRoutes);
    }
    // --- End Shop Locations Mounting ---

    console.log('[Server Config] Route mounting process completed.');
};

mountRoutes();

app.use(errorHandler);

const server = actualHttp.createServer(app);

const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, async () => {
            console.log(`[Server Startup] Server listening on http://localhost:${PORT}`);
            console.log(`[Server Startup] Frontend expected at: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
            try {
                await createInitialAdmin();
            } catch (adminError) {
                console.error("[Server Startup] Error during initial admin creation:", adminError.message);
            }
            console.log('[Server Startup] Application ready.');
        });
    } catch (error) {
        console.error('CRITICAL FAILURE TO START SERVER:', error.message, error.stack);
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason.message || reason, reason.stack);
    if (server && server.listening) server.close(() => process.exit(1)); else process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err.message, err.stack);
    if (server && server.listening) server.close(() => process.exit(1)); else process.exit(1);
});

startServer();