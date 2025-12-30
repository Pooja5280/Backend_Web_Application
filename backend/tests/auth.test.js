const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

// Connect to the database before running tests
beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
        await mongoose.connect(uri);
    }
});

// Clean up: Delete the specific users we create in the tests
afterEach(async () => {
    await User.deleteMany({ email: { $in: ['register@example.com', 'login@example.com'] } });
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
                fullName: 'Reg User',
                email: 'register@example.com', // Unique email for this test
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
    });

    // TEST 2: User Login (Success)
    it('should login an existing user', async () => {
        // 1. Create a user manually (The Model's pre-save hook will hash the password)
        await User.create({
            fullName: 'Login User',
            email: 'login@example.com', // Unique email for this test
            password: 'password123' 
        });

        // 2. Try logging in with the same password
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'password123'
            });
            
        // Debugging: If this fails, print the error message
        if (res.statusCode !== 200) {
            console.log("Login Error Response:", res.body);
        }

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    // TEST 3: User Login (Failure - Wrong Password)
    it('should reject login with incorrect password', async () => {
        await User.create({
            fullName: 'Fail User',
            email: 'login@example.com', // Reuse email since previous test cleaned up
            password: 'password123'
        });

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'login@example.com',
                password: 'wrongpassword'
            });
        
        expect(res.statusCode).toEqual(400); 
    });

    // TEST 4: Input Validation (Invalid Email)
    it('should not register user with invalid email', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                fullName: 'Bad Email',
                email: 'not-an-email',
                password: 'password123'
            });
            
        expect(res.statusCode).not.toEqual(201); 
    });

    // TEST 5: Protected Route Access
    it('should fail to access users list without token', async () => {
        const res = await request(app).get('/api/users'); 
        expect(res.statusCode).toEqual(401);
    });
});