const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] // Basic format validation [cite: 37]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' 
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active' 
    },
    lastLogin: {
        type: Date,
        default: null 
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);