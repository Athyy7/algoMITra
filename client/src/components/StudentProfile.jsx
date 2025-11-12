import React from 'react';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  User, 
  Mail, 
  Shield, 
  Edit, 
  Award, 
  FileText, 
  CheckSquare 
} from 'lucide-react';
import ActivityHeatmap from './ActivityHeatmap'; // Import the heatmap

// This component receives the profile data and the logout/edit functions
const StudentProfile = ({ profile, onEdit, onLogout }) => {
  
  // Helper function to capitalize roles
  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

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
              onError={(e) => { e.target.onerror = null; e.target.src="https.avatar.vercel.sh/fallback.svg" }}
            />
          ) : (
            // Placeholder if no photoUrl
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
          onClick={onEdit} // Triggers the modal in the parent
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

      {/* --- Right Column: Stats & Activity --- */}
      <div className="lg:col-span-2">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white/30 border border-slate-300/40 rounded-xl backdrop-blur-xl">
            <CheckSquare className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-xs text-slate-600">Problems Solved</p>
            <p className="text-2xl font-bold text-slate-900">{profile.problemsSolved}</p>
          </div>
          <div className="p-4 bg-white/30 border border-slate-300/40 rounded-xl backdrop-blur-xl">
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-xs text-slate-600">Total Submissions</p>
            <p className="text-2xl font-bold text-slate-900">{profile.submissionActivity.length}</p>
          </div>
          <div className="p-4 bg-white/30 border border-slate-300/40 rounded-xl backdrop-blur-xl">
            <Award className="w-6 h-6 text-yellow-600 mb-2" />
            <p className="text-xs text-slate-600">Badges Earned</p>
            <p className="text-2xl font-bold text-slate-900">{profile.badges.length}</p>
          </div>
        </div>

        {/* Activity Heatmap */}
        <ActivityHeatmap activityData={profile.submissionActivity} />

        {/* Badges Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Badges
          </h3>
          <div className="flex flex-wrap gap-3">
            {profile.badges.map((badge) => (
              <div key={badge} className="flex items-center gap-2 py-2 px-4 bg-white/50 border border-slate-300/50 rounded-full shadow-sm">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-slate-700">{badge}</span>
              </div>
            ))}
            {/* Creative Badge: Beta Tester */}
            <div className="flex items-center gap-2 py-2 px-4 bg-purple-100/50 border border-purple-300/50 rounded-full shadow-sm" title="You're an early supporter!">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-700">Beta Tester</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;