import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [
      /^\S+@\S+\.\S+$/,
      'Please provide a valid email.'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['student', 'teacher'], 
    default: 'student'           
  },

  // --- NEW PROFILE FIELDS ---
  bio: {
    type: String,
    default: 'No bio yet. Click edit to add one!',
    maxlength: 250
  },
  photoUrl: {
    type: String,
    default: '' // We'll use a placeholder on the frontend if this is empty
  },
  badges: {
    type: [String],
    default: ['New User'] // Start everyone with a default badge
  },
  // We'll store submission activity as a Map
  // Key: "YYYY-MM-DD", Value: count
  submissionActivity: {
    type: Map,
    of: Number,
    default: {}
  }
  // --- END OF NEW FIELDS ---

}, { timestamps: true }); 

/**
 * @desc    Password Hashing Middleware
 * This function runs before any 'save' operation on a User document.
 */
userSchema.pre('save', async function(next) {
  // 'this' refers to the user document about to be saved
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a "salt" for hashing
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Password Comparison Method
 * This adds a custom 'comparePassword' method to our user documents.
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  // 'this.password' is the hashed password in the database
  return await bcrypt.compare(candidatePassword, this.password);
};

// --- This is the fix for the hot-reload crash ---
// It checks if the model is already compiled before trying to compile it again.
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;