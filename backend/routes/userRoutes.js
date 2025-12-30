const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserStatus, updateUserProfile } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin Routes
router.get('/', protect, admin, getAllUsers); 
router.put('/:id/status', protect, admin, updateUserStatus); 

// User Routes
router.put('/profile', protect, updateUserProfile); 

module.exports = router;