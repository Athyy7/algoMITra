import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/user.js';

const router = express.Router();

/**
 * @route   GET /api/profile/me
 * @desc    Get full profile for the logged-in user
 * @access  Private
 */
router.get('/me', protect, async (req, res) => {
  try {
    // req.user is attached by the 'protect' middleware
    // We can just send the req.user object since it was
    // already fetched from the DB and had the password removed.
    res.status(200).json({
      success: true,
      user: req.user 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

/**
 * @route   PUT /api/profile
 * @desc    Update user profile (bio, photo)
 * @access  Private
 */
router.put('/', protect, async (req, res) => {
  try {
    const { bio, photoUrl } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update only the fields that were passed
    if (bio) user.bio = bio;
    if (photoUrl) user.photoUrl = photoUrl;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        photoUrl: updatedUser.photoUrl,
        badges: updatedUser.badges,
        submissionActivity: updatedUser.submissionActivity,
      },
      message: 'Profile updated successfully.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// In a real app, you would have another endpoint here that adds submission activity
// e.g., router.post('/activity', protect, ...)
// For this demo, we'll just mock the data on the frontend.

export default router;