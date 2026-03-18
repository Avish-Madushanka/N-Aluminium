require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const fs = require('fs');

const connectDB = require('./config/db');

console.log('[Server Startup] Initializing: Attempting to load route modules...');
let clientRoutes, bOwnerRoutes, authRoutes, calendarSettingsRoutes,
    bookingRoutes, reviewRoutes, scrapTypeRoutes, shopLocationRoutes, adminRoutes,
    saleItemRoutes, adminStatsRoutes, projectRoutes, itemRoutes, cartRoutes;

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
cartRoutes = loadRoute('cartRoutes', './routes/cartRoutes');

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

const uploadsDirectory = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDirectory));

if (fs.existsSync(uploadsDirectory)) {
    console.log(`[Server Config] Serving static files from ${uploadsDirectory} at /uploads`);
    const subdirectories = ['saleitems', 'projects', 'profiles', 'items', 'cart'];
    subdirectories.forEach(subDir => {
        const fullSubDirPath = path.join(uploadsDirectory, subDir);
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
        const subdirectoriesToCreate = ['saleitems', 'projects', 'profiles', 'items', 'cart'];
        subdirectoriesToCreate.forEach(subDir => {
            const fullSubDirPath = path.join(uploadsDirectory, subDir);
            fs.mkdirSync(fullSubDirPath, { recursive: true });
            console.log(`[Server Config] Successfully created 'uploads/${subDir}' subdirectory.`);
        });
    } catch (err) {
        console.error(`[Server Config] FAILED to create 'uploads' directory: ${err.message}`);
    }
}

app.get('/api/health', (req, res) => {
    console.log('[Health Check] /api/health endpoint was hit.');
    res.status(200).json({ status: 'ok', message: 'Backend API is running and healthy.' });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working', timestamp: new Date().toISOString() });
});

console.log('[Server Config] Mounting routes directly...');

const routeMountMap = new WeakMap();

function mountRoute(app, path, router) {
    if (!router) return;
    app.use(path, router);
    const stack = app._router.stack;
    for (let i = stack.length - 1; i >= 0; i--) {
        const layer = stack[i];
        if (layer.handle === router) {
            routeMountMap.set(layer, path);
            break;
        }
    }
}

mountRoute(app, '/api/auth', authRoutes);
mountRoute(app, '/api/clients', clientRoutes);
mountRoute(app, '/api/b-owners', bOwnerRoutes);
mountRoute(app, '/api/calendar-settings', calendarSettingsRoutes);
mountRoute(app, '/api/bookings', bookingRoutes);
mountRoute(app, '/api/reviews', reviewRoutes);
mountRoute(app, '/api/scrap-types', scrapTypeRoutes);
mountRoute(app, '/api/shop-locations', shopLocationRoutes);
mountRoute(app, '/api/saleitems', saleItemRoutes);
mountRoute(app, '/api/projects', projectRoutes);
mountRoute(app, '/api/admin', adminRoutes);
mountRoute(app, '/api/admin/stats', adminStatsRoutes);

if (itemRoutes) {
    mountRoute(app, '/api/items', itemRoutes);
    console.log('[Server Config]  SUCCESS: Mounted itemRoutes at /api/items');
} else {
    console.error('[Server Config]  ERROR: itemRoutes is null or undefined!');
}

if (cartRoutes) {
    mountRoute(app, '/api/cart', cartRoutes);
    console.log('[Server Config]  SUCCESS: Mounted cartRoutes at /api/cart');
} else {
    console.error('[Server Config]  ERROR: cartRoutes is null or undefined!');
}

console.log('\n=== REGISTERED ROUTES ===');

function printRoutes(stack, basePath = '') {
    const routes = [];

    stack.forEach(layer => {
        if (layer.route) {
            const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
            const fullPath = (basePath + layer.route.path).replace(/\/+/g, '/');
            routes.push(`${methods} ${fullPath}`);
        } else if (layer.handle && layer.handle.stack) {
            let mountPath = routeMountMap.get(layer) || '';

            if (!mountPath && layer.regexp) {
                const src = layer.regexp.source;
                const match = src.match(/^\^((?:\\\/[^\\?*()|]+)+)/);
                if (match) {
                    mountPath = match[1].replace(/\\\//g, '/');
                }
            }

            const nestedRoutes = printRoutes(layer.handle.stack, basePath + mountPath);
            routes.push(...nestedRoutes);
        }
    });

    return routes;
}

const allRoutes = printRoutes(app._router.stack);
allRoutes.sort().forEach(route => console.log(route));

console.log('\n=== END ROUTES ===\n');

console.log('[Server Config] Applying global error handler.');
app.use(errorHandler);

const server = http.createServer(app);

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
        if (error.stack) console.error(error.stack);
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('!!!!!!!!!!!!!!!! UNHANDLED PROMISE REJECTION !!!!!!!!!!!!!!!!');
    console.error('Reason:', reason.message || reason);
    if (reason && reason.stack) console.error(reason.stack);
    console.error('Promise:', promise);
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    if (server && server.listening) {
        server.close(() => { process.exit(1); });
    } else {
        process.exit(1);
    }
});

process.on('uncaughtException', (err) => {
    console.error('!!!!!!!!!!!!!!!! UNCAUGHT EXCEPTION !!!!!!!!!!!!!!!!');
    console.error('Error:', err.message);
    if (err.stack) console.error(err.stack);
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

    if (server && server.listening) {
        server.close(() => { process.exit(1); });
    } else {
        process.exit(1);
    }
});

startServer();