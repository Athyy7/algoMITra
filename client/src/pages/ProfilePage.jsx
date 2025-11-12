import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Image as ImageIcon, Save } from 'lucide-react';
import { CgSpinner } from 'react-icons/cg'; // Using this for consistency

// Import the two different profile UIs
import StudentProfile from '../components/StudentProfile';
import TeacherProfile from '../components/TeacherProfile';

// --- Edit Profile Modal Component ---
const EditProfileModal = ({ profile, onSave, onClose }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      photoUrl: profile.photoUrl || '',
      bio: profile.bio || '',
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data) => {
    setIsSaving(true);
    await onSave(data);
    setIsSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        className="relative w-full max-w-lg p-8 rounded-3xl border border-white/60 bg-white/90 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-900 transition"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="photoUrl" className="block text-sm font-medium text-slate-700 mb-1">
              Profile Photo URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                id="photoUrl"
                type="text"
                placeholder="https://your-image-url.com/photo.png"
                {...register('photoUrl')}
                className="w-full py-3 pl-10 pr-4 bg-white/50 border-2 border-slate-300/40 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">
              Your Bio
            </label>
            <textarea
              id="bio"
              rows="4"
              placeholder="Tell us a bit about yourself..."
              {...register('bio', { maxLength: 250 })}
              className="w-full py-3 px-4 bg-white/50 border-2 border-slate-300/40 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSaving}
            className="w-full flex justify-center items-center py-3 font-semibold text-white bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <CgSpinner className="animate-spin text-2xl" />
            ) : (
              <><Save size={18} className="mr-2" /> Save Changes</>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};


// --- Main Profile Page Wrapper ---
const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext); // Get role from context
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Fetch full profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Use the /api/profile/me route we created
        const { data } = await api.get('/api/profile/me'); 
        if (data.success) {
          setProfile(data.user);
        } else {
          setError(data.message || 'Failed to fetch profile.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred.');
        // If token is bad or expired, log the user out
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []); // Runs once on page load

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  // This function is passed to the modal
  const handleSaveProfile = async (formData) => {
    try {
      // Use the new PUT /api/profile route
      const { data } = await api.put('/api/profile', {
        bio: formData.bio,
        photoUrl: formData.photoUrl,
      });
      if (data.success) {
        setProfile(data.user); // Update state with the new user object
        setIsEditing(false); // Close the modal
      } else {
        alert(data.message || 'Failed to save profile.');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred while saving.');
    }
  };

  // --- Render States ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50">
        <Loader2 className="animate-spin text-4xl text-slate-700" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50">
        <p className="text-red-500">{error || 'Could not load profile.'}</p>
        <button onClick={handleLogout} className="mt-4 text-blue-500 underline">
          Logout
        </button>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <>
      <div className="relative flex justify-center min-h-screen bg-gradient-to-b from-white to-slate-50 overflow-hidden pt-32 pb-20 font-[Inter]">
        {/* Gradient Blobs */}
        <motion.div
          className="absolute top-[50px] left-[5%] w-[350px] h-[350px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60"
          animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[60px] right-[10%] w-[300px] h-[300px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
          animate={{ y: [0, 30, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        {/* --- ROLE-BASED RENDER --- */}
        {/* This is the new logic. It renders the correct component based on user role. */}
        {profile.role === 'teacher' ? (
          <TeacherProfile 
            profile={profile}
            onEdit={() => setIsEditing(true)}
            onLogout={handleLogout}
          />
        ) : (
          <StudentProfile 
            profile={profile}
            onEdit={() => setIsEditing(true)}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* The Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <EditProfileModal 
            profile={profile}
            onSave={handleSaveProfile}
            onClose={() => setIsEditing(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfilePage;