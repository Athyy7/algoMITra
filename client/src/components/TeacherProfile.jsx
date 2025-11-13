import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  User, 
  Mail, 
  Shield, 
  Edit,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  List,
  BarChart2
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../api/axios';

// Helper to get the right color for difficulty
const DifficultyBadge = ({ difficulty }) => {
  const colors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
};


// This component receives the profile data and the logout/edit functions
const TeacherProfile = ({ profile, onEdit, onLogout }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ visible: false, success: false, message: '' });
  
  // --- NEW STATE FOR THE FEATURE ---
  const [myProblems, setMyProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(true);

  // Helper function to capitalize roles
  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

  // --- NEW useEffect to fetch created problems ---
  useEffect(() => {
    const fetchMyProblems = async () => {
      try {
        setProblemsLoading(true);
        const { data } = await api.get('/api/problems/my-problems');
        if (data.success) {
          setMyProblems(data.problems);
        }
      } catch (error) {
        console.error("Failed to fetch teacher's problems", error);
      } finally {
        setProblemsLoading(false);
      }
    };

    fetchMyProblems();
  }, []); // Runs once when the component mounts

  // Setup form for creating problems
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      difficulty: 'Medium',
      testCases: [{ input: '', output: '', isSample: true }]
    }
  });

  // Setup dynamic array for test cases
  const { fields, append, remove } = useFieldArray({
    control,
    name: "testCases"
  });

  // Handle the "Add Problem" form submission
  const onProblemSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitStatus({ visible: false, success: false, message: '' });

    try {
      const { data } = await api.post('/api/problems', formData);
      if (data.success) {
        setSubmitStatus({ visible: true, success: true, message: 'Problem created successfully!' });
        reset(); // Clear the form
        remove(); // Remove all fields
        append({ input: '', output: '', isSample: true }); // Add one default field
        
        // --- NEW: Add the new problem to the top of the list in real-time ---
        setMyProblems([data.problem, ...myProblems]);
      } else {
        setSubmitStatus({ visible: true, success: false, message: data.message || 'Failed to create problem.' });
      }
    } catch (err) {
      setSubmitStatus({ visible: true, success: false, message: err.response?.data?.message || 'An error occurred.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus({ ...submitStatus, visible: false }), 3000);
    }
  };

  // --- NEW: Calculate stats based on the fetched problems ---
  const stats = {
    total: myProblems.length,
    easy: myProblems.filter(p => p.difficulty === 'Easy').length,
    medium: myProblems.filter(p => p.difficulty === 'Medium').length,
    hard: myProblems.filter(p => p.difficulty === 'Hard').length,
  };


  return (
    <div 
      className="relative z-10 w-full max-w-6xl p-8 rounded-3xl border border-white/60 bg-white/70 shadow-2xl backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-3 gap-8"
      style={{
        boxShadow:
          "0 20px 60px rgba(0, 0, 0, 0.1), inset 0 1px 4px rgba(255,255,255,0.5)",
      }}
    >
      {/* --- Left Column: User Info --- */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:border-r lg:pr-8 border-slate-300/60">
        {/* Profile Photo */}
        <div className="relative">
          {profile.photoUrl ? (
            <img
              src={profile.photoUrl}
              alt={profile.name}
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src="https://avatar.vercel.sh/fallback.svg" }}
            />
          ) : (
            <div className="flex items-center justify-center w-36 h-36 rounded-full border-4 border-white shadow-lg bg-slate-200">
              <User className="w-20 h-20 text-slate-500" />
            </div>
          )}
        </div>

        {/* Name, Email, Role */}
        <h1 className="text-3xl font-bold text-slate-900 mt-5">{profile.name}</h1>
        <p className="text-md text-slate-600 flex items-center gap-2 mt-1">
          <Mail size={16} /> {profile.email}
        </p>
        <p className="text-md text-slate-600 flex items-center gap-2 mt-1">
          <Shield size={16} /> {capitalize(profile.role)}
        </p>

        {/* Bio */}
        <p className="text-sm text-slate-700 mt-6 italic text-center lg:text-left">
          "{profile.bio || 'No bio yet. Click Edit Profile to add one!'}"
        </p>

        {/* Edit Profile Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEdit} // Triggers the modal
          className="mt-4 w-full lg:w-auto py-2 px-5 font-semibold text-slate-700 bg-white/60 border border-slate-400/50 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Edit size={16} /> Edit Profile
        </motion.button>
        
        {/* Logout Button */}
        <div className="w-full border-t border-slate-300/60 mt-auto pt-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout} // Triggers logout
            className="w-full flex justify-center items-center py-3 font-semibold text-white bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </motion.button>
        </div>
      </div>

      {/* --- Right Column: Teacher Dashboard --- */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Faculty Dashboard</h2>
        
        {/* --- NEW STATS SECTION --- */}
        <div className="p-4 bg-white/30 border border-slate-300/40 rounded-xl backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Problem Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-white/30 border border-slate-300/40 rounded-xl">
              <List className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-xs text-slate-600">Total Created</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
             <div className="p-3 bg-white/30 border border-slate-300/40 rounded-xl">
              <BarChart2 className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-xs text-slate-600">Easy</p>
              <p className="text-2xl font-bold text-slate-900">{stats.easy}</p>
            </div>
             <div className="p-3 bg-white/30 border border-slate-300/40 rounded-xl">
              <BarChart2 className="w-6 h-6 text-yellow-600 mb-2" />
              <p className="text-xs text-slate-600">Medium</p>
              <p className="text-2xl font-bold text-slate-900">{stats.medium}</p>
            </div>
             <div className="p-3 bg-white/30 border border-slate-300/40 rounded-xl">
              <BarChart2 className="w-6 h-6 text-red-600 mb-2" />
              <p className="text-xs text-slate-600">Hard</p>
              <p className="text-2xl font-bold text-slate-900">{stats.hard}</p>
            </div>
          </div>
        </div>

        {/* --- NEW "MY PROBLEMS" LIST --- */}
        <div className="p-4 bg-white/30 border border-slate-300/40 rounded-xl backdrop-blur-xl">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">My Created Problems</h3>
          <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
            {problemsLoading ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="animate-spin text-slate-500" />
              </div>
            ) : myProblems.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-4">You haven't created any problems yet. Use the form below to get started!</p>
            ) : (
              myProblems.map(problem => (
                <div key={problem._id} className="flex justify-between items-center p-3 bg-white/50 border border-slate-300/50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{problem.title}</p>
                    <p className="text-xs text-slate-500">
                      Created on: {new Date(problem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* --- Create Problem Form (Existing) --- */}
        <form 
          onSubmit={handleSubmit(onProblemSubmit)} 
          className="p-6 bg-white/30 border border-slate-300/40 rounded-xl backdrop-blur-xl space-y-4"
        >
          <h3 className="text-lg font-semibold text-slate-800">Create New Problem</h3>
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="mt-1 block w-full py-2 px-3 bg-white/50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              id="description"
              rows="5"
              {...register('description', { required: 'Description is required' })}
              className="mt-1 block w-full py-2 px-3 bg-white/50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
          </div>

          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700">Difficulty</label>
            <select
              id="difficulty"
              {...register('difficulty')}
              className="mt-1 block w-full py-2 px-3 bg-white/50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Test Cases */}
          <div>
            <h4 className="text-md font-medium text-slate-700 mb-2">Test Cases</h4>
            <div className="space-y-3">
              {fields.map((item, index) => (
                <div key={item.id} className="p-3 bg-white/20 border border-slate-300/40 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-slate-600">Test Case {index + 1}</p>
                    {fields.length > 1 && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <textarea
                      {...register(`testCases.${index}.input`, { required: 'Input is required' })}
                      placeholder="Input"
                      rows="3"
                      className="block w-full py-2 px-3 bg-white/50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                    <textarea
                      {...register(`testCases.${index}.output`, { required: 'Output is required' })}
                      placeholder="Output"
                      rows="3"
                      className="block w-full py-2 px-3 bg-white/50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="mt-2 flex items-center">
                    <input
                      id={`testCases.${index}.isSample`}
                      type="checkbox"
                      {...register(`testCases.${index}.isSample`)}
                      className="h-4 w-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor={`testCases.${index}.isSample`} className="ml-2 block text-sm text-slate-700">
                      Sample Test Case (visible to student)
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => append({ input: '', output: '', isSample: false })}
              className="mt-3 py-2 px-4 font-semibold text-slate-700 bg-white/60 border border-slate-400/50 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Test Case
            </motion.button>
          </div>
          
          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 font-semibold text-white bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin text-2xl" />
            ) : (
              "Submit Problem"
            )}
          </motion.button>

          {/* Success/Error Message */}
          <AnimatePresence>
            {submitStatus.visible && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                  submitStatus.success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
                }`}
              >
                {submitStatus.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {submitStatus.message}
              </motion.div>
            )}
          </AnimatePresence>

        </form>
      </div>
    </div>
  );
};

export default TeacherProfile;