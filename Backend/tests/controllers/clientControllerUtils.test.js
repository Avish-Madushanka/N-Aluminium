// tests/controllers/clientControllerUtils.test.js
const fs = require('fs');
const path = require('path');

// Mock the 'fs' module
jest.mock('fs');

// Import the function *after* mocking fs if it's directly exported
// If it's not exported, you might need to test the controller method that uses it
// Assuming deletePhoto was exported (or refactored to be testable)
const { deletePhoto } = require('../../controllers/clientController'); // Hypothetical export

describe('Client Controller Utilities', () => {
  beforeEach(() => {
    // Reset mocks before each test
    fs.existsSync.mockClear();
    fs.unlinkSync.mockClear();
    console.log = jest.fn(); // Mock console.log if needed
    console.error = jest.fn();
  });

  it('deletePhoto should call unlinkSync if file exists', () => {
    const photoPath = '/uploads/profiles/test.jpg';
    const expectedFullPath = path.join(__dirname, '../..', photoPath); // Adjust path depth

    fs.existsSync.mockReturnValue(true); // Simulate file exists

    deletePhoto(photoPath);

    expect(fs.existsSync).toHaveBeenCalledWith(expectedFullPath);
    expect(fs.unlinkSync).toHaveBeenCalledWith(expectedFullPath);
    // expect(console.log).toHaveBeenCalledWith(expect.stringContaining(expectedFullPath));
  });

  it('deletePhoto should not call unlinkSync if file does not exist', () => {
    const photoPath = '/uploads/profiles/nonexistent.jpg';
     const expectedFullPath = path.join(__dirname, '../..', photoPath);

    fs.existsSync.mockReturnValue(false); // Simulate file doesn't exist

    deletePhoto(photoPath);

    expect(fs.existsSync).toHaveBeenCalledWith(expectedFullPath);
    expect(fs.unlinkSync).not.toHaveBeenCalled();
  });

  it('deletePhoto should handle unlinkSync errors', () => {
    const photoPath = '/uploads/profiles/error.jpg';
     const expectedFullPath = path.join(__dirname, '../..', photoPath);
    const mockError = new Error('Permission denied');

    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockImplementation(() => {
      throw mockError; // Simulate error during deletion
    });

    deletePhoto(photoPath);

    expect(fs.unlinkSync).toHaveBeenCalledWith(expectedFullPath);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(expectedFullPath), mockError);
  });

  it('deletePhoto should do nothing if path is empty', () => {
    deletePhoto('');
    deletePhoto(null);
    deletePhoto(undefined);
    expect(fs.existsSync).not.toHaveBeenCalled();
    expect(fs.unlinkSync).not.toHaveBeenCalled();
  });
});