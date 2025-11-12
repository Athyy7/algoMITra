import React from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // Import router components

// Your existing components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Our new pages
import HomePage from './pages/HomePage';     // Your homepage layout
import AuthPage from './pages/AuthPage';     // The login/register page
// We'll create these pages soon
// import ProfilePage from './pages/ProfilePage'; 
// import ProblemsPage from './pages/ProblemsPage';
// import EditorPage from './pages/EditorPage';
// import AiMitraPage from './pages/AiMitraPage';

function App() {
  return (
    <div>
      {/* Navbar is outside the Routes, so it stays on every page */}
      <Navbar />

      <main>
        <Routes>
          {/* Route 1: Your Homepage */}
          {/* This renders your original layout at "http://localhost:5173/" */}
          <Route path="/" element={<HomePage />} />

          {/* Route 2: Our new Auth Page */}
          {/* This renders the AuthPage at ".../login" and ".../register" */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          {/* TODO: Add these routes later
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/problems" element={<ProblemsPage />} />
            <Route path="/problem/:id" element={<EditorPage />} />
            <Route path="/mitra" element={<AiMitraPage />} />
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

      {/* Footer is also outside the Routes, so it stays on every page */}
      <Footer />
    </div>

  );
}

export default App;
