const mongoose = require('mongoose');

const connectDB = async () => {

  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected.');
    return;
  }

  if (mongoose.connection.readyState === 2 || mongoose.connection.readyState === 3) {
    console.warn(`Mongoose connection is currently in state: ${mongoose.connection.readyState}. Proceeding with new connection attempt.`);
  }

  try {
    if (!process.env.MONGO_URI) {
      console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
      process.exit(1);
    }

    const atIndex = process.env.MONGO_URI.indexOf('@');
    const loggableUri = atIndex > -1 ? process.env.MONGO_URI.substring(0, atIndex) : process.env.MONGO_URI;
    console.log(`Attempting to connect to MongoDB with URI starting: ${loggableUri}...`);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, 
      maxPoolSize: 15,               
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.removeAllListeners('connected');
    mongoose.connection.removeAllListeners('error');
    mongoose.connection.removeAllListeners('disconnected');

    mongoose.connection.on('connected', () => console.log('Mongoose event: Connected to DB.'));
    mongoose.connection.on('error', (err) => console.error(`Mongoose event: Connection error: ${err.message}`));
    mongoose.connection.on('disconnected', () => console.log('Mongoose event: Disconnected from DB.'));

  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(error); 
    }
    console.error('Terminating application due to database connection failure.');
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing Mongoose connection...`);
  if (mongoose.connection.readyState === 1) { 
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
  process.exit(0); 
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));   
process.on('SIGTERM', () => gracefulShutdown('SIGTERM')); 

module.exports = connectDB;