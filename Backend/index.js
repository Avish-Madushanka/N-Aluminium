// --- START OF FILE index.js ---
const app = require('./server');
const config = require('./config');

const PORT = config.port;

const server = app.listen(PORT, () => {
   console.log(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
   console.log(`Access API at http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    console.error(err.stack);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    console.error(err.stack);
    server.close(() => process.exit(1));
});
// --- END OF FILE index.js ---