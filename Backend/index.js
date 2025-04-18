const app = require('./server');
const config = require('./config');
const PORT = config.port;

const server = app.listen(PORT, () => { console.log(`Server running in ${config.nodeEnv} on port ${PORT}`); });
process.on('unhandledRejection', (err, promise) => { console.error(`Unhandled Rejection: ${err.message}`); server.close(() => process.exit(1)); });
process.on('uncaughtException', (err) => { console.error(`Uncaught Exception: ${err.message}`); server.close(() => process.exit(1)); });