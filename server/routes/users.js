// server/routes/users.js

const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Get logged-in user's profile
router.get('/profile', protect, getUserProfile);

module.exports = router;