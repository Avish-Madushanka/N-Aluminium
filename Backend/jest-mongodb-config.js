// jest-mongodb-config.js
module.exports = {
  mongodbMemoryServerOptions: {
    binary: { /* ... */ },
    instance: {
      dbName: 'jest',
      port: 27018, // Choose a high, likely unused port for testing this
    },
    autoStart: false,
  },
};