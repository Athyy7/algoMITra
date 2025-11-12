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
router.post('/', protect, isTeacher, async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;

    // Basic validation
    if (!title || !description || !difficulty || !testCases || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields: title, description, difficulty, and at least one test case.'
      });
    }

    // Check if problem with this title already exists
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

// --- Future routes ---
// You can add GET routes here for students to fetch problems
/**
 * @route   GET /api/problems
 * @desc    Get all problems
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const problems = await Problem.find({}).select('-testCases.output'); // Hide test case outputs
    res.status(200).json({ success: true, problems });
  } catch (error) {
    console.error('Get Problems Error:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});


export default router;