require('dotenv').config();

const express = require('express');
const cors = require('cors');
const actualPath = require('path');
const actualHttp = require('http');
const fs = require('fs');

const connectDB = require('./config/db');

console.log('[Server Startup] Initializing: Attempting to load route modules...');
let clientRoutes, bOwnerRoutes, authRoutes, calendarSettingsRoutes,
    bookingRoutes, reviewRoutes, scrapTypeRoutes, shopLocationRoutes, adminRoutes,
    saleItemRoutes, adminStatsRoutes, projectRoutes, itemRoutes;

const loadRoute = (routeName, path) => {
  try {
    const routeModule = require(path);
    console.log(`[Server Startup] Successfully loaded ${routeName} from ${path}. Type: ${typeof routeModule}`);
    if (typeof routeModule !== 'function' && (typeof routeModule !== 'object' || !routeModule.stack)) {
      console.warn(`[Server Startup] WARNING: ${routeName} loaded from ${path}, but it does not appear to be an Express router. Check module.exports in that file.`);
    }
    return routeModule;
  } catch (e) {
    console.error(`[Server Startup] FAILED to load ${routeName} from ${path}: ${e.message}`);
    if (process.env.NODE_ENV === 'development') console.error(e.stack);
    return null;
  }
};

clientRoutes = loadRoute('clientRoutes', './routes/clientRoutes');
bOwnerRoutes = loadRoute('bOwnerRoutes', './routes/bOwnerRoutes');
authRoutes = loadRoute('authRoutes', './routes/authRoutes');
calendarSettingsRoutes = loadRoute('calendarSettingsRoutes', './routes/calendarSettingsRoutes');
bookingRoutes = loadRoute('bookingRoutes', './routes/bookingRoutes');
reviewRoutes = loadRoute('reviewRoutes', './routes/reviewRoutes');
scrapTypeRoutes = loadRoute('scrapTypeRoutes', './routes/scrapTypeRoutes');
shopLocationRoutes = loadRoute('shopLocationRoutes', './routes/shopLocationRoutes');
adminRoutes = loadRoute('adminRoutes', './routes/adminRoutes');
saleItemRoutes = loadRoute('saleItemRoutes', './routes/saleItemRoutes');
adminStatsRoutes = loadRoute('adminStatsRoutes', './routes/adminStatsRoutes');
projectRoutes = loadRoute('projectRoutes', './routes/projectRoutes');
itemRoutes = loadRoute('itemRoutes', './routes/itemRoutes');

console.log('[Server Startup] Loading controllers and middleware...');
const { createInitialAdmin } = require('./controllers/adminController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5003;

console.log('[Server Config] Applying core middleware...');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const uploadsDirectory = actualPath.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDirectory));

if (fs.existsSync(uploadsDirectory)) {
    console.log(`[Server Config] Serving static files from ${uploadsDirectory} at /uploads`);
    const subdirectories = ['saleitems', 'projects', 'profiles', 'items'];
    subdirectories.forEach(subDir => {
        const fullSubDirPath = actualPath.join(uploadsDirectory, subDir);
        if (fs.existsSync(fullSubDirPath)) {
            console.log(`[Server Config] 'uploads/${subDir}' subdirectory exists.`);
        } else {
            console.warn(`[Server Config] 'uploads/${subDir}' subdirectory NOT found. Creating...`);
            try {
                fs.mkdirSync(fullSubDirPath, { recursive: true });
                console.log(`[Server Config] Successfully created 'uploads/${subDir}' subdirectory.`);
            } catch (err) {
                console.error(`[Server Config] FAILED to create 'uploads/${subDir}' subdirectory: ${err.message}`);
            }
        }
    });
} else {
    console.warn(`[Server Config] 'uploads' directory (${uploadsDirectory}) does not exist. Creating...`);
    try {
        fs.mkdirSync(uploadsDirectory, { recursive: true });
        console.log(`[Server Config] Successfully created 'uploads' directory at ${uploadsDirectory}`);
        const subdirectoriesToCreate = ['saleitems', 'projects', 'profiles', 'items'];
        subdirectoriesToCreate.forEach(subDir => {
            const fullSubDirPath = actualPath.join(uploadsDirectory, subDir);
            fs.mkdirSync(fullSubDirPath, { recursive: true });
            console.log(`[Server Config] Successfully created 'uploads/${subDir}' subdirectory.`);
        });
    } catch (err) {
        console.error(`[Server Config] FAILED to create 'uploads' directory: ${err.message}`);
    }
}

// Test routes
app.get('/api/health', (req, res) => {
    console.log('[Health Check] /api/health endpoint was hit.');
    res.status(200).json({ status: 'ok', message: 'Backend API is running and healthy.' });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working', timestamp: new Date().toISOString() });
});

// DIRECT ROUTE MOUNTING - SIMPLIFIED
console.log('[Server Config] Mounting routes directly...');

// Mount all routes directly
if (authRoutes) app.use('/api/auth', authRoutes);
if (clientRoutes) app.use('/api/clients', clientRoutes);
if (bOwnerRoutes) app.use('/api/b-owners', bOwnerRoutes);
if (calendarSettingsRoutes) app.use('/api/calendar-settings', calendarSettingsRoutes);
if (bookingRoutes) app.use('/api/bookings', bookingRoutes);
if (reviewRoutes) app.use('/api/reviews', reviewRoutes);
if (scrapTypeRoutes) app.use('/api/scrap-types', scrapTypeRoutes);
if (shopLocationRoutes) app.use('/api/shop-locations', shopLocationRoutes);
if (saleItemRoutes) app.use('/api/saleitems', saleItemRoutes);
if (projectRoutes) app.use('/api/projects', projectRoutes);
if (adminRoutes) app.use('/api/admin', adminRoutes);
if (adminStatsRoutes) app.use('/api/admin/stats', adminStatsRoutes);

// CRITICAL: Mount items route
if (itemRoutes) {
    app.use('/api/items', itemRoutes);
    console.log('[Server Config] ✅ SUCCESS: Mounted itemRoutes at /api/items');
} else {
    console.error('[Server Config] ❌ ERROR: itemRoutes is null or undefined!');
}

// List all registered routes for debugging
console.log('\n=== REGISTERED ROUTES ===');
app._router.stack.forEach(function(layer){
    if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        console.log(`${methods} ${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
        console.log(`Router: ${layer.regexp}`);
    }
});
console.log('=== END ROUTES ===\n');

console.log('[Server Config] Applying global error handler.');
app.use(errorHandler);

const server = actualHttp.createServer(app);

const startServer = async () => {
    try {
        console.log('[Server Startup] Attempting to connect to MongoDB...');
        await connectDB();

        server.listen(PORT, async () => {
            console.log(`[Server Startup] SERVER LISTENING on http://localhost:${PORT}`);
            console.log(`[Server Startup] Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`[Server Startup] Frontend URL configured for CORS: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);

            try {
                console.log('[Server Startup] Attempting to create initial admin user...');
                await createInitialAdmin();
            } catch (adminError) {
                console.error("[Server Startup] Error during initial admin creation:", adminError.message);
            }
            console.log('[Server Startup] Application is ready and running.');
        });
    } catch (error) {
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('[Server Startup] CRITICAL FAILURE TO START SERVER:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('!!!!!!!!!!!!!!!! UNHANDLED PROMISE REJECTION !!!!!!!!!!!!!!!!');
    console.error('Reason:', reason.message || reason);
    if (reason && reason.stack) {
        console.error(reason.stack);
    }
    console.error('Promise:', promise);
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    if (server && server.listening) {
        console.log('Closing server due to unhandled rejection...');
        server.close(() => {
            console.error('Server closed.');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

process.on('uncaughtException', (err) => {
    console.error('!!!!!!!!!!!!!!!! UNCAUGHT EXCEPTION !!!!!!!!!!!!!!!!');
    console.error('Error:', err.message);
    if (err.stack) {
        console.error(err.stack);
    }
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    if (server && server.listening) {
        console.log('Closing server due to uncaught exception...');
        server.close(() => {
            console.error('Server closed.');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

startServer();