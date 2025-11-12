import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  isSample: { // Is this a sample test case (visible to user) or hidden?
    type: Boolean,
    default: false
  }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  difficulty: {
    type: String,
    required: [true, 'Please select a difficulty'],
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  testCases: [testCaseSchema], // Array of test cases
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Links to the User model
  }
}, { timestamps: true });

const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);

export default Problem;