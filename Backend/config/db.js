// config/db.js
const mongoose = require('mongoose');
const config = require('./config'); // For potential future use if db config needs JWT_SECRET etc.

const connectDB = async () => {
  // Close any existing connections to avoid memory leaks during multiple calls (more relevant for testing)
  if (mongoose.connection.readyState !== 0 && mongoose.connection.readyState !== 3) { // 0 = disconnected, 3 = disconnecting
    console.log('Disconnecting existing Mongoose connection...');
    await mongoose.disconnect();
  }

  try {
    if (!process.env.MONGO_URI) {
      console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Increased timeout
      maxPoolSize: 15, // Increased pool size
      // Mongoose 6+ no longer needs these options:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose re-connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from DB');
    });

  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    console.error('Terminating application due to database connection failure.');
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing Mongoose connection...`);
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) { // 1 = connected, 2 = connecting
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination.');
  }
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));


module.exports = connectDB;