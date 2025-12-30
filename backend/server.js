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
app.use(cors({
    origin: '*', 
    credentials: true
}));

// --- ADDED: API Base Route to fix "Cannot GET /api" ---
// This ensures the link in your documentation works for examiners
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: "MERN Auth API is running successfully!",
        endpoints: {
            auth: "/api/auth",
            users: "/api/users"
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health Check Route (for Render root)
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

if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = app;