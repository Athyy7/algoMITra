import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; 

// Import routes
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import problemRoutes from './routes/problem.js';
import aiRoutes from './routes/ai.js'; // --- NEW AI ROUTE IMPORT ---
import { protect } from './middleware/authMiddleware.js';

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---
app.use(cors()); 
app.use(express.json());

// --- API Routes ---
// Public auth routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/profile', protect, profileRoutes); 
app.use('/api/problems', protect, problemRoutes); 
app.use('/api/ai', protect, aiRoutes); // --- NEW AI ROUTE USAGE ---

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); 
  });

// Simple root route for health check
app.get('/', (req, res) => {
  res.send('algoMITra API is alive!');
});