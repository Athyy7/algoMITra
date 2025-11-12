import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; 

// Import routes
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js'; // Import new profile routes
import problemRoutes from './routes/problem.js'; // Import new problem routes
import { protect } from './middleware/authMiddleware.js'; // Import protect middleware

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---
app.use(cors()); 
app.use(express.json());

// --- API Routes ---
// Public auth routes (login/register/getme)
app.use('/api/auth', authRoutes);

// Protected profile routes (get full profile, update profile)
app.use('/api/profile', protect, profileRoutes); 

// Protected problem routes (create problem, get problems)
app.use('/api/problems', protect, problemRoutes); 

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    // Start listening only after DB connection is successful
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  });

// Simple root route for health check
app.get('/', (req, res) => {
  res.send('algoMITra API is alive!');
});