import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Your existing components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Our new pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';

// --- NEW IMPORTS ---
import ProfilePage from './pages/ProfilePage'; // 1. Import the profile page
import ProtectedRoute from './components/ProtectedRoute'; // 2. Import the guard

function App() {
  return (
    <div>

      <Navbar />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />


          <Route path="/login" element={<AuthPage />} />

          <Route path="/register" element={<AuthPage />} />

          {/* --- NEW PROTECTED ROUTE --- */}
          {/* This route is wrapped by ProtectedRoute */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* TODO: Add these routes later
            <Route path="/problems" element={<ProtectedRoute><ProblemsPage /></ProtectedRoute>} />
            <Route path="/problem/:id" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
            <Route path="/mitra" element={<ProtectedRoute><AiMitraPage /></ProtectedRoute>} />
          */}
          
          {/* A catch-all for 404s */}
          <Route path="*" element={
            <div className="text-center py-20 min-h-screen">
              <h1 className="text-3xl font-bold">404 - Not Found</h1>
              <p className="mt-4">Yikes. That page doesn't exist, chief.</p>
              <Link to="/" className="text-purple-400 mt-2 inline-block">Go Home</Link>
            </div>
          } />

        </Routes>
      </main>


      <Footer />
    </div>

  );
}

export default App;
