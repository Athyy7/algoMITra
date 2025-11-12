import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // This path is correct

const router = express.Router();

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

    // --- NEW VALIDATION ---
    // Validate the role
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
    // The pre-save hook in '../models/user.js' will automatically hash the password
    const user = new User({
      name,
      email,
      password,
      role // Save the new role
    });

    // 4. Save user to database
    await user.save();

    // 5. Create JWT Payload (now with role!)
    const payload = {
      id: user._id,
      role: user.role // Add role to the token payload
    };

    // 6. Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ensure JWT_SECRET is in your .env
      { expiresIn: '3d' } // Expires in 3 days
    );

    // 7. Send success response with token and user info
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // Return the role in the response
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

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    // 3. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.'
      });
    }

    // 4. Create JWT Payload (now with role!)
    const payload = {
      id: user._id,
      role: user.role // Add role to the token payload
    };

    // 5. Sign the token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Ensure JWT_SECRET is in your .env
      { expiresIn: '3d' }
    );

    // 6. Send success response with token and user info
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // Return the role in the response
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

export default router;