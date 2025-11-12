import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isTeacher } from '../middleware/roleMiddleware.js';
import Problem from '../models/problem.js';

const router = express.Router();

/**
 * @route   POST /api/problems
 * @desc    Create a new problem
 * @access  Private (Teachers only)
 */
router.post('/', isTeacher, async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;

    if (!title || !description || !difficulty || !testCases || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields: title, description, difficulty, and at least one test case.'
      });
    }

    const existingProblem = await Problem.findOne({ title });
    if (existingProblem) {
      return res.status(409).json({
        success: false,
        message: 'A problem with this title already exists.'
      });
    }

    const problem = new Problem({
      title,
      description,
      difficulty,
      testCases,
      createdBy: req.user.id // req.user.id comes from the 'protect' middleware
    });

    const createdProblem = await problem.save();
    
    res.status(201).json({
      success: true,
      problem: createdProblem,
      message: 'Problem created successfully.'
    });

  } catch (error) {
    console.error('Create Problem Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while creating problem.',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/problems
 * @desc    Get all problems (simplified)
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    // This route is for students to see all problems
    const problems = await Problem.find({}).select('-testCases.output'); 
    res.status(200).json({ success: true, problems });
  } catch (error) {
    console.error('Get Problems Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

/**
 * @route   GET /api/problems/my-problems
 * @desc    Get all problems created by the logged-in teacher
 * @access  Private (Teachers only)
 */
router.get('/my-problems', isTeacher, async (req, res) => {
  try {
    // Find all problems where 'createdBy' matches the logged-in user's ID
    const problems = await Problem.find({ createdBy: req.user.id })
      .select('-testCases') // Exclude test cases to keep the list light
      .sort({ createdAt: -1 }); // Show newest first

    res.status(200).json({ success: true, problems });
  } catch (error) {
    console.error('Get My Problems Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


export default router;