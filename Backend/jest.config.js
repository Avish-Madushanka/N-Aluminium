// jest.config.js
module.exports = {
    testEnvironment: 'node', // Use Node.js environment
    preset: '@shelf/jest-mongodb', // Use the MongoDB preset
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'], // Optional: for global setup like clearing DB
    testPathIgnorePatterns: ['/node_modules/'],
    coveragePathIgnorePatterns: ['/node_modules/', '/config/', '/tests/'], // Exclude config/tests from coverage
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    // Other Jest options as needed
  };