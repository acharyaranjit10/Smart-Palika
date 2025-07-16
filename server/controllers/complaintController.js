// server/controllers/complaintController.js

const Complaint = require('../models/Complaint');

// @desc    File a new complaint
// @route   POST /api/complaints
exports.createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      province,
      municipality,
      ward,
      wardNo,
      location
    } = req.body;

    const newComplaint = new Complaint({
      userId: req.user.userId,
      title,
      description,
      province,
      municipality,
      ward,
      wardNo,
      location,
      imageUrl: req.file?.path, // Hosted URL from Cloudinary
      status: 'Submitted',
      statusHistory: [{ status: 'Submitted', date: new Date() }]
    });

    await newComplaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint: newComplaint });
  } catch (err) {
    console.error('Create complaint error:', err);
    res.status(500).json({ message: 'Server error while submitting complaint' });
  }
};
// @desc    Get complaints for logged-in user
// @route   GET /api/complaints
exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.userId }).sort({ date: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    console.error('Fetch user complaints error:', err);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

// @desc    Get complaints relevant to admin role
// @route   GET /api/complaints/admin
exports.getAdminComplaints = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { adminLevel, ward, municipality, province } = req.user;
    let filter = {};

    if (adminLevel === 'ward') {
      filter.wardNo = ward.number;
      filter.municipality = municipality.name;
    } else if (adminLevel === 'municipality') {
      filter.municipality = municipality.name;
    } else if (adminLevel === 'province') {
      filter.province = province.name;
    }

    const complaints = await Complaint.find(filter).sort({ date: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    console.error('Fetch admin complaints error:', err);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

// @desc    Update complaint status (admin)
// @route   PUT /api/complaints/:id/status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.status = status;
    complaint.statusHistory.push({ status, date: new Date() });

    await complaint.save();
//     console.log("Status updated for:", complaint._id);
// console.log("New status:", complaint.status);
// console.log("Status history:", complaint.statusHistory);
    res.status(200).json({ message: 'Complaint status updated' });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};