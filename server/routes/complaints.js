// server/routes/complaints.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary'); // Assuming you completed Step 4
const upload = multer({ storage });
const {
  createComplaint,
  getUserComplaints,
  getAdminComplaints,
  updateComplaintStatus
} = require('../controllers/complaintController');

const { protect } = require('../middleware/authMiddleware');
const adminScopeCheck = require('../middleware/adminScopeCheck');


// Complaint routes
// router.post('/', protect, createComplaint); // File a complaint
router.post('/', protect, upload.single('image'), createComplaint);

router.get('/', protect, getUserComplaints); // Personal dashboard

router.get('/admin', protect, adminScopeCheck, getAdminComplaints);
// Admin panel view

router.put('/:id/status', protect, updateComplaintStatus); // Admin updates complaint status

module.exports = router;