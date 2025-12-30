const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();


app.use(express.json()); 
app.use(cors()); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});


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

// Only connect to DB and start server if this file is run directly
if (require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = app; // Export app for testing
