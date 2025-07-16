const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register a new user (or admin with approval)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const {
      name, email, phone, password, address,
      province, municipality, ward,
      role, adminLevel, approvalCode
    } = req.body;

    // Check for existing user
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Admin approval validation
    if (role === 'admin') {
      if (!adminLevel || !approvalCode) {
        return res.status(400).json({ message: 'Admin level and approval code required' });
      }
      if (approvalCode !== process.env.APPROVAL_CODE) {
        return res.status(403).json({ message: 'Invalid approval code' });
      }
    }

    // Create user
    const newUser = new User({
      name,
      email,
      phone,
      password,
      address,
      province: { id: province.id, name: province.name },
      municipality: { id: municipality.id, name: municipality.name },
      ward: { number: ward.number },
      role,
      adminLevel: role === 'admin' ? adminLevel : null
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user and return JWT
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const payload = {
  userId: user._id,
  role: user.role,
  adminLevel: user.adminLevel,
  ward: user.ward,
  municipality: user.municipality,
  province: user.province
};
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminLevel: user.adminLevel,
        ward: user.ward,
        municipality: user.municipality,
        province: user.province,
        address: user.address,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};