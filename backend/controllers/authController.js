const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Used for comparison in login
const jwt = require('jsonwebtoken');

// Helper: Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (password.length < 6) {
             return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // --- FIXED: Removed manual hashing here ---
        // The User model's pre('save') middleware will hash it automatically.
        
        const isFirstAccount = (await User.countDocuments({})) === 0;
        const role = isFirstAccount ? 'admin' : 'user';

        const user = await User.create({
            fullName,
            email,
            password, // Passing plain text password (will be hashed by model)
            role
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Need to explicitly select password if 'select: false' is in model
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // --- SECURITY CHECK: Stop Deactivated Users ---
        if (user.status === 'inactive') {
            return res.status(403).json({ 
                message: 'Account deactivated. Please contact support.' 
            });
        }
        // ----------------------------------------------

        // Check password using the method defined in User model (or manual comparison)
        // Since we defined matchPassword in User.js, we can use that, OR use bcrypt directly.
        // Using bcrypt directly here for clarity matching your previous code:
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // --- REQUIREMENT MET: Update Last Login ---
        // We set validateBeforeSave: false to prevent validation errors on other fields if any
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false }); 

        res.json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            token: generateToken(user.id, user.role),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    const user = {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
    };
    res.status(200).json(user);
};