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
  // --- NEW FIELD ---
  // This is the new field for Role-Based Access Control
  role: {
    type: String,
    enum: ['student', 'teacher'], // Only allows these two values
    default: 'student'           // Default new signups to 'student'
  }
  // We can add profile fields here later (like bio, photoUrl, etc.)

}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

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