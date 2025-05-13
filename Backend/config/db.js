// backend/config/db.js (or backend/db.js)
const mongoose = require('mongoose');

const connectDB = async () => {
  // If already connected, no need to do anything.
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected.');
    return;
  }

  // If in the process of connecting or disconnecting, wait for that to resolve
  // or decide on a strategy (e.g., log and return, or error).
  // For simplicity at startup, we'll proceed, but this is a place for more complex logic if needed.
  if (mongoose.connection.readyState === 2 || mongoose.connection.readyState === 3) {
    console.warn(`Mongoose connection is currently in state: ${mongoose.connection.readyState}. Proceeding with new connection attempt.`);
    // Optionally, you could try to disconnect first if in state 2 or 3, but it can get complex.
    // For startup, usually, a fresh connection is desired if not already 'connected'.
  }

  try {
    if (!process.env.MONGO_URI) {
      console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
      process.exit(1);
    }

    // Log URI safely (hide credentials part if present after '@')
    const atIndex = process.env.MONGO_URI.indexOf('@');
    const loggableUri = atIndex > -1 ? process.env.MONGO_URI.substring(0, atIndex) : process.env.MONGO_URI;
    console.log(`Attempting to connect to MongoDB with URI starting: ${loggableUri}...`);

    // Mongoose 6+ defaults are generally good.
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // How long to wait for server selection before failing
      maxPoolSize: 15,                 // Max number of connections in the pool
      // minPoolSize: 5,               // Optional: Maintain a minimum number of connections
      // socketTimeoutMS: 45000,       // Optional: How long a send/receive on a socket can take
      // connectTimeoutMS: 30000,      // Optional: How long the driver will wait for a connection
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // --- Setup Event Listeners (ideally only once per application lifecycle) ---
    // Mongoose connection object is a singleton, so listeners can be attached here.
    // Remove previous listeners if any, to avoid multiple logs on re-connect attempts by this function
    mongoose.connection.removeAllListeners('connected');
    mongoose.connection.removeAllListeners('error');
    mongoose.connection.removeAllListeners('disconnected');

    mongoose.connection.on('connected', () => console.log('Mongoose event: Connected to DB.'));
    mongoose.connection.on('error', (err) => console.error(`Mongoose event: Connection error: ${err.message}`));
    mongoose.connection.on('disconnected', () => console.log('Mongoose event: Disconnected from DB.'));
    // Optional: Listen for reconnection events if your strategy involves it
    // mongoose.connection.on('reconnected', () => console.log('Mongoose event: Reconnected to DB.'));
    // mongoose.connection.on('reconnectFailed', () => console.error('Mongoose event: Failed to reconnect to DB.'));

  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(error); // Log full error in dev
    }
    console.error('Terminating application due to database connection failure.');
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing Mongoose connection...`);
  if (mongoose.connection.readyState === 1) { // Only try to close if connected
    try {
      await mongoose.connection.close();
      console.log('Mongoose connection closed successfully due to app termination.');
    } catch (closeError) {
      console.error('Error closing Mongoose connection during shutdown:', closeError.message);
    }
  } else if (mongoose.connection.readyState !== 0) {
    console.log(`Mongoose connection state was '${mongoose.connection.readyState}', not attempting to close.`);
  } else {
    console.log('Mongoose connection was already closed or not established.');
  }
  process.exit(0); // Exit gracefully
};

// Setup listeners for process termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));   // Ctrl+C
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); // kill command

module.exports = connectDB;