import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; // Import cors

// Import auth routes
import authRoutes from './routes/auth.js';

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---
// 1. Enable CORS for all origins
app.use(cors()); 

// 2. Enable JSON body parsing
app.use(express.json());

// --- API Routes ---
// Mount the authentication routes
app.use('/api/auth', authRoutes);

// (Future routes can be added here)
// app.use('/api/problems', problemRoutes); 

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