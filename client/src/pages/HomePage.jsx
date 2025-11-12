import React from "react";
import Hero from "../components/Hero";
import MeetMITra from "../components/MeetMITra";
import ProblemArchive from "../components/ProblemsArchive";
import Features from "../components/Features";
import Leaderboard from "../components/Leaderboard";

const HomePage = () => {
  return (
    <>
      <section id="hero"><Hero /></section>
      <section id="mitra"><MeetMITra /></section>
      <section id="problems"><ProblemArchive /></section>
      <section id="features"><Features /></section>
      <section id="leaderboard"><Leaderboard /></section>
    </>
  );
};

export default HomePage;
