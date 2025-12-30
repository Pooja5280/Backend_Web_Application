const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all users (with pagination)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    const pageSize = 10; 
    const page = Number(req.query.pageNumber) || 1;

    try {
        const count = await User.countDocuments({});
        const users = await User.find({})
            .select('-password') 
            .limit(pageSize)              // <--- ADD THIS LINE HERE!
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 }); 

        res.json({ users, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user status (Active/Inactive)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.status = req.body.status; 
            const updatedUser = await user.save();
            res.json({ message: `User marked as ${updatedUser.status}` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                 const salt = await bcrypt.genSalt(10);
                 user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};