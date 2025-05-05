// tests/api.test.js (or tests/auth.test.js, etc.)
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server'); // Import your configured Express app
const Client = require('../../models/clientModel'); // Import models needed for setup/assertions
const BusinessOwner = require('../../models/bOwnerModel');
// ... other models

let server;

// Start the server before tests run (using a random port might be safer)
beforeAll((done) => {
    server = app.listen(done); // Let Jest handle port allocation or use a specific test port
});

// Close the server after tests finish
afterAll((done) => {
    server.close(done);
});

// --- Test Suites ---

describe('Auth API Endpoints', () => {
    // Clear users before each auth test
    beforeEach(async () => {
        await Client.deleteMany({});
        await BusinessOwner.deleteMany({});
    });

    // ---- unifiedLogin ----
    describe('POST /api/auth/login', () => {
        it('should login a registered client successfully', async () => {
            // 1. Register a user directly via model for setup
            const clientData = { name: 'Test Client', email: 'client@test.com', password: 'password123', contactNumber: '123', address:'addr', district:'dist', province:'prov' };
            const client = new Client(clientData);
            await client.save(); // Save hashed password

            // 2. Attempt login via API
            const res = await request(server)
                .post('/api/auth/login')
                .send({ email: 'client@test.com', password: 'password123' });

            // 3. Assertions
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(res.body.message).toContain('client');
            expect(res.body.data).toBeDefined();
            expect(res.body.data.email).toBe('client@test.com');
            expect(res.body.data.userType).toBe('client');
            expect(res.body.data.role).toBe('client');
            expect(res.body.data.password).toBeUndefined(); // IMPORTANT: Ensure password is not sent back
        });

        it('should login a registered bowner successfully', async () => {
             // 1. Register a bowner
            const bOwnerData = { businessId: 'B01', businessName: 'Test Biz', ownerName: 'Test Owner', email: 'bowner@test.com', password: 'password123', contactNumber: '123', address:'addr', district:'dist', province:'prov' };
            const bOwner = new BusinessOwner(bOwnerData);
            await bOwner.save();

            // 2. Attempt login
             const res = await request(server)
                .post('/api/auth/login')
                .send({ email: 'bowner@test.com', password: 'password123' });

             // 3. Assertions
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(res.body.message).toContain('bowner');
            expect(res.body.data.email).toBe('bowner@test.com');
            expect(res.body.data.userType).toBe('bowner');
            expect(res.body.data.role).toBe('bowner'); // Assuming default role
            expect(res.body.data.password).toBeUndefined();
        });

         it('should return 401 for incorrect password', async () => {
             // Register user first
             const clientData = { name: 'Test Client', email: 'wrongpass@test.com', password: 'password123', contactNumber: '123', address:'addr', district:'dist', province:'prov' };
             const client = new Client(clientData);
             await client.save();

             const res = await request(server)
                .post('/api/auth/login')
                .send({ email: 'wrongpass@test.com', password: 'wrongpassword' });

            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Invalid email or password');
        });

         it('should return 401 for non-existent email', async () => {
             const res = await request(server)
                .post('/api/auth/login')
                .send({ email: 'nobody@test.com', password: 'password123' });

            expect(res.statusCode).toEqual(401);
             expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Invalid email or password');
        });

         it('should return 400 if email or password is missing', async () => {
            const res1 = await request(server).post('/api/auth/login').send({ email: 'test@test.com' });
            expect(res1.statusCode).toEqual(400);
            expect(res1.body.message).toContain('Please provide both');

             const res2 = await request(server).post('/api/auth/login').send({ password: 'password123' });
            expect(res2.statusCode).toEqual(400);
             expect(res2.body.message).toContain('Please provide both');
        });
    });

    // ---- Logout (Simple acknowledgment tests) ----
     describe('POST /api/auth/client/logout', () => {
         it('should return 200 for client logout acknowledgment', async () => {
            const res = await request(server).post('/api/auth/client/logout');
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('acknowledgement successful');
        });
    });
    // Add similar test for bowner logout
});

describe('Client API Endpoints', () => {
    let authToken; // Store token for protected routes

    beforeAll(async () => {
        // Register and login a user to get a token before client tests
        await Client.deleteMany({});
        const clientData = { name: 'Token User', email: 'token@test.com', password: 'password123', contactNumber: '123', address:'addr', district:'dist', province:'prov' };
        await new Client(clientData).save();
        const loginRes = await request(server).post('/api/auth/login').send({ email: 'token@test.com', password: 'password123' });
        authToken = loginRes.body.token; // Store the token
         expect(authToken).toBeDefined(); // Ensure token was received
    });

    // ---- registerClient ----
    describe('POST /api/clients/register', () => {
        it('should register a new client with valid data', async () => {
            const res = await request(server)
                .post('/api/clients/register')
                .field('name', 'New User')
                .field('email', 'newuser@test.com')
                .field('contactNumber', '555-1212')
                .field('password', 'newpass123')
                .field('address', '1 New St')
                .field('district', 'Colombo')
                .field('province', 'Western');
                // Optionally attach a file: .attach('profilePhoto', 'path/to/test-image.jpg');

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('Client registered successfully');
            expect(res.body.data.email).toBe('newuser@test.com');
            expect(res.body.data.password).toBeUndefined();

             // Verify in DB (optional but good)
            const newUser = await Client.findOne({ email: 'newuser@test.com' });
            expect(newUser).not.toBeNull();
            expect(newUser.name).toBe('New User');
        });

        it('should return 400 for missing required fields', async () => {
            const res = await request(server)
                .post('/api/clients/register')
                .field('email', 'missing@test.com'); // Missing name, password etc.

            expect(res.statusCode).toEqual(400);
             expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('Please provide all required fields');
        });

         it('should return 400 if email already exists', async () => {
             // Register user first
             await request(server).post('/api/clients/register').send({ name: 'Existing', email: 'exists@test.com', password: 'password123', contactNumber: '123', address:'addr', district:'dist', province:'prov' });

             // Try registering again with the same email
            const res = await request(server)
                .post('/api/clients/register')
                .send({ name: 'Another', email: 'exists@test.com', password: 'password456', contactNumber: '456', address:'addr2', district:'dist2', province:'prov2' });

            expect(res.statusCode).toEqual(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain('already exists');
        });

        // Add tests for file upload validation (size, type) if multer is configured for it
    });

    // ---- getClientById (Protected Route) ----
    describe('GET /api/clients/:id', () => {
        let testClientId;

        beforeAll(async () => {
            // Find the ID of the user logged in during the initial setup
            const user = await Client.findOne({ email: 'token@test.com' });
            testClientId = user._id.toString();
        });

        it('should get client profile if authenticated', async () => {
            const res = await request(server)
                .get(`/api/clients/${testClientId}`)
                .set('Authorization', `Bearer ${authToken}`); // Send token

            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data._id).toEqual(testClientId);
            expect(res.body.data.email).toBe('token@test.com');
            expect(res.body.data.password).toBeUndefined();
        });

        it('should return 401 if not authenticated', async () => {
            const res = await request(server).get(`/api/clients/${testClientId}`); // No token
            expect(res.statusCode).toEqual(401);
             expect(res.body.message).toContain('No token provided');
        });

        it('should return 403 if trying to access another user profile (if not admin)', async () => {
             // Create another client
             const otherClient = await new Client({ name: 'Other', email: 'other@test.com', password: 'password123', contactNumber: '789', address:'addr', district:'dist', province:'prov' }).save();
             const otherClientId = otherClient._id.toString();

            const res = await request(server)
                .get(`/api/clients/${otherClientId}`) // Requesting OTHER user's data
                .set('Authorization', `Bearer ${authToken}`); // Using token@test.com's token

            // The current middleware returns 403 in authorize, but protectClient returns 401 if user not found.
            // Let's stick to the `getClientById` controller's own 403 check implementation.
            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toContain('Not authorized');
        });

         it('should return 404 if client ID does not exist', async () => {
             const nonExistentId = new mongoose.Types.ObjectId(); // Generate a valid but non-existent ID
            const res = await request(server)
                .get(`/api/clients/${nonExistentId}`)
                .set('Authorization', `Bearer ${authToken}`);

            // The controller middleware (protectClient) might return 401 if it fails to find the *requesting* user
            // The controller itself returns 404 if the *target* user isn't found. Check which applies.
            // Based on getClientById, it checks req.user first, then finds the target user.
            // If the target isn't found, it should be 404.
             expect(res.statusCode).toEqual(404);
             expect(res.body.message).toContain('Client not found');
         });
    });

    // ---- updateClient ----
    // Add similar tests: needs auth, updates correctly, handles validation, handles file updates/deletion

    // ---- deleteClient ----
    // Add similar tests: needs auth, deletes correctly, handles 404, handles authorization
});

// --- Add describe blocks for other resource APIs (BOwners, Bookings, etc.) ---
// Follow the same pattern: Setup -> Make Request -> Assertions
// Remember to handle authentication for protected routes.

describe('Booking API Endpoints', () => {
    // --- createBooking ---
     describe('POST /api/bookings', () => {
        let materialTypeId, timeSlotId, serviceAreaId;

         // Setup common data needed for bookings (assuming settings/materials exist or mock them)
        beforeAll(async () => {
             // Ensure some settings/material data exists for valid IDs
             // You might seed this in beforeAll or mock the findOne calls in the controller
             materialTypeId = 'cans'; // Use IDs from your default/seeded data
             timeSlotId = 'morning';
             serviceAreaId = 'downtown';
             // Mocking example (if not seeding DB):
             // jest.spyOn(Material, 'findOne').mockResolvedValue({ id: materialTypeId, active: true });
             // jest.spyOn(Settings, 'findOne').mockResolvedValue({ timeSlots: [{id: timeSlotId, active: true}], serviceAreas: [{id: serviceAreaId, active: true}] });
        });

        const validBookingData = {
            selectedDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            timeSlotId: 'morning',
            serviceAreaId: 'downtown',
            materialTypeId: 'cans',
            estimatedWeight: 10,
            pickupLocation: '123 Test Street, Testville',
            contactDetails: {
                name: 'Jane Doe',
                phone: '555-987-6543',
                email: 'jane@test.com'
            }
        };

        it('should create a booking with valid data', async () => {
            const res = await request(server)
                .post('/api/bookings')
                .send(validBookingData);

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('Booking confirmed successfully');
            expect(res.body.data).toBeDefined();
            expect(res.body.data.bookingId).toBeDefined();
            expect(res.body.data.status).toBe('confirmed');
            expect(res.body.data.timeSlotId).toBe(validBookingData.timeSlotId);
            expect(res.body.data.contactDetails.email).toBe(validBookingData.contactDetails.email);
            expect(res.body.data.estimatedWeight).toBe(validBookingData.estimatedWeight);
        });

         it('should return 400 if required fields are missing', async () => {
             const invalidData = { ...validBookingData };
             delete invalidData.selectedDate; // Remove a required field

             const res = await request(server)
                .post('/api/bookings')
                .send(invalidData);

             expect(res.statusCode).toEqual(400);
             expect(res.body.success).toBe(false);
             expect(res.body.message).toMatch(/Missing required booking information/); // Check for specific message part
        });

         it('should return 400 if contact details are incomplete', async () => {
             const invalidData = {
                 ...validBookingData,
                contactDetails: { name: 'Incomplete' } // Missing phone/email
             };

             const res = await request(server)
                 .post('/api/bookings')
                 .send(invalidData);

             expect(res.statusCode).toEqual(400);
             expect(res.body.success).toBe(false);
             expect(res.body.message).toContain('Missing required contact details');
        });

         it('should handle validation errors from the model', async () => {
             const invalidData = { ...validBookingData, contactDetails: { ...validBookingData.contactDetails, email: 'invalid-email' }};

             const res = await request(server)
                 .post('/api/bookings')
                 .send(invalidData);

             expect(res.statusCode).toEqual(400);
             expect(res.body.success).toBe(false);
             expect(res.body.message).toContain('Validation Failed');
             expect(res.body.message).toContain('valid email address');
         });

         it('should handle optional estimatedWeight correctly (valid number)', async () => {
             const dataWithWeight = { ...validBookingData, estimatedWeight: "15.5" };
             const res = await request(server).post('/api/bookings').send(dataWithWeight);
             expect(res.statusCode).toEqual(201);
             expect(res.body.data.estimatedWeight).toBe(15.5);
         });

          it('should handle optional estimatedWeight correctly (omitted)', async () => {
             const dataWithoutWeight = { ...validBookingData };
             delete dataWithoutWeight.estimatedWeight;
             const res = await request(server).post('/api/bookings').send(dataWithoutWeight);
             expect(res.statusCode).toEqual(201);
             expect(res.body.data.estimatedWeight).toBeUndefined();
         });

         it('should handle optional estimatedWeight correctly (invalid string)', async () => {
             const dataWithInvalidWeight = { ...validBookingData, estimatedWeight: "abc" };
             const res = await request(server).post('/api/bookings').send(dataWithInvalidWeight);
             expect(res.statusCode).toEqual(201); // Still creates booking, weight ignored
             expect(res.body.data.estimatedWeight).toBeUndefined();
         });

         // Add tests for advanced validation if you uncomment that section in controller
         // (e.g., mocking Settings.findOne, Material.findOne to return inactive items)
    });

    // Add tests for getBookingById, getAllBookings, updateBookingStatus
    // Remember to handle authentication for admin routes using a token from a logged-in admin user.
});

// --- End Test Suites ---