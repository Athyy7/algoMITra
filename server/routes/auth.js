import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { protect } from '../middleware/authMiddleware.js'; // Import protect middleware

const router = express.Router();

// Define the allowed email domain
const ALLOWED_EMAIL_DOMAIN = '@mitwpu.edu.in';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password, role).'
      });
    }

    // --- NEW EMAIL VALIDATION ---
    if (!email.endsWith(ALLOWED_EMAIL_DOMAIN)) {
      return res.status(400).json({
        success: false,
        message: `Invalid email. Only ${ALLOWED_EMAIL_DOMAIN} addresses are allowed.`
      });
    }
    // --- END NEW VALIDATION ---

    if (role !== 'student' && role !== 'teacher') {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "student" or "teacher".'
      });
    }

    // 2. Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    // 3. Create new user instance
    const user = new User({
      name,
      email,
      password,
      role
    });

    // 4. Save user to database
    await user.save();

    // 5. Create JWT Payload
    const payload = {
      id: user._id,
      role: user.role
    };

    // 6. Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '3d' } 
    );

    // 7. Send success response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: 'User registered successfully.'
    });

  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }
    
    // --- NEW LOGIN VALIDATION ---
    // Also check login for valid domain, just in case
    if (!email.endsWith(ALLOWED_EMAIL_DOMAIN)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please use a @mitwpu.edu.in email.'
      });
    }
    // --- END NEW VALIDATION ---

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.'
      });
    }

    const payload = {
      id: user._id,
      role: user.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: 'User logged in successfully.'
    });

  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message
    });
  }
});


/**
 * @route   GET /api/auth/me
 * @desc    Get current user's data (without password)
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    // req.user is attached by the 'protect' middleware
    // We select '-password' to exclude the password hash
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      user: user // Send the full user object (minus password)
    });

  } catch (error) {
    console.error('Get Me Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;