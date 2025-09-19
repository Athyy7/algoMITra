import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import "./index.css";
import MeetMITra from "./components/MeetMITra";
import ProblemArchive from "./components/ProblemsArchive";
import Features from "./components/Features";
import Leaderboard from "./components/Leaderboard";
import Footer from "./components/Footer";

function App() {
  return (
    <>
    <div>
      <Navbar />
      <main>
        <Hero />
        <MeetMITra />
        <ProblemArchive />
        <Features />
        <Leaderboard />
        <Footer />

      </main>
    </div>
      
      
    </>
  );
}

export default App;
