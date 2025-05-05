// tests/models/bookingModel.test.js
const mongoose = require('mongoose');
const Booking = require('../../models/bookingModel'); // Adjust path

describe('Booking Model', () => {
  it('should require essential fields', async () => {
    const bookingData = {}; // Missing required fields
    const booking = new Booking(bookingData);
    let err;
    try {
      await booking.validate();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.selectedDate).toBeDefined();
    expect(err.errors.timeSlotId).toBeDefined();
    expect(err.errors.serviceAreaId).toBeDefined();
    expect(err.errors.materialTypeId).toBeDefined();
    expect(err.errors.pickupLocation).toBeDefined();
    expect(err.errors['contactDetails.name']).toBeDefined();
    expect(err.errors['contactDetails.phone']).toBeDefined();
    expect(err.errors['contactDetails.email']).toBeDefined();
  });

  it('should have default status as "confirmed"', () => {
    const booking = new Booking({
      // Provide minimum required fields
      selectedDate: new Date(),
      timeSlotId: 'morning',
      serviceAreaId: 'downtown',
      materialTypeId: 'cans',
      pickupLocation: '123 Test St',
      contactDetails: { name: 'Test', phone: '123', email: 'test@test.com' }
    });
    expect(booking.status).toBe('confirmed');
  });

   it('should generate a default bookingId', () => {
    const booking = new Booking({ /* ...required fields */ });
    expect(booking.bookingId).toMatch(/^ALU-\d{4}-\w{5}$/); // Regex based on your default format
  });

  it('should validate contact email format', async () => {
     const booking = new Booking({
       /* ...other required fields */
       contactDetails: { name: 'Test', phone: '123', email: 'invalid-email' }
     });
     let err;
     try { await booking.validate(); } catch (error) { err = error; }
     expect(err).toBeDefined();
     expect(err.errors['contactDetails.email'].message).toContain('valid email address');
  });

  // Add more tests for enums, min/max values, etc.
});