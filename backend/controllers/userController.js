const User = require('../models/User');

// @desc    Get all users (with pagination)
exports.getAllUsers = async (req, res) => {
    const pageSize = 10; 
    const page = Number(req.query.pageNumber) || 1;

    try {
        const count = await User.countDocuments({});
        const users = await User.find({})
            .select('-password') 
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 }); 

        res.json({ users, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user status (Active/Inactive)
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
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;

            // Pass plain text password - the User model middleware hashes it
            if (req.body.password) {
                user.password = req.body.password; 
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