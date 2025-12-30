const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); 

// --- UPDATED: Secure CORS Configuration ---
// This allows cookies/headers to be sent securely
app.use(cors({
    origin: '*', // In production, replace this with your frontend URL (e.g., 'https://myapp.vercel.app')
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health Check Route
app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 5000;

// --- TESTING SETUP ---
// Only connect to DB and start server if this file is run directly.
// If imported by a test file (like auth.test.js), it won't start automatically.
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = app; // Export app for testing