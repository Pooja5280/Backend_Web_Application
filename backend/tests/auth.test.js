const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // We need to export app from server.js
const User = require('../models/User');

// Connect to a test database before running tests
beforeAll(async () => {
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }
});

// Clean up the database after each test so they don't conflict
afterEach(async () => {
    await User.deleteMany({ email: 'test@example.com' });
});

// Close connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Authentication API Endpoints', () => {
    
    // TEST 1: User Registration
    it('should register a new user successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                fullName: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                confirmPassword: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    // TEST 2: User Login (Success)
    it('should login an existing user', async () => {
        // First create the user
        await request(app).post('/api/auth/register').send({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123'
        });

        // Try logging in
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    // TEST 3: User Login (Failure - Wrong Password)
    it('should reject login with incorrect password', async () => {
        // First create the user
        await request(app).post('/api/auth/register').send({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123'
        });

        // Try logging in with WRONG password
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
        // CORRECTED: Your backend sends 401 for wrong password
        expect(res.statusCode).toEqual(401); 
    });

    // TEST 4: Input Validation (Invalid Email)
    it('should not register user with invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                fullName: 'Test User',
                email: 'not-an-email',
                password: 'password123'
            });
        expect(res.statusCode).not.toEqual(201); 
    });

    // TEST 5: Protected Route Access
    it('should fail to access users list without token', async () => {
        // CORRECTED: Hitting the /api/users endpoint which definitely exists
        const res = await request(app).get('/api/users'); 
        expect(res.statusCode).toEqual(401);
    });
});