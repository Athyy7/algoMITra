// client/src/components/Navbar.jsx

import React, { useState, useEffect } from "react";
import { User, Bot, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Problems", href: "#" },
    { name: "Contests", href: "#" },
    { name: "Leaderboard", href: "#" },
    { name: "MITra AI", href: "#", icon: <Bot size={14} />, beta: true },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-xl bg-white/60 transition-shadow duration-300 
      ${hasScrolled ? "shadow-md border-b border-gray-200/60" : "border-b border-transparent"}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 font-plusjakarta">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-slate-900">&lt;/&gt;</span>
          <div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">algoMITra</span>
            <p className="text-[11px] text-gray-500 -mt-0.5">where bugs become features ✨</p>
          </div>
        </div>

        {/* Center: Links */}
        <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-700">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="relative flex items-center gap-2 text-gray-600 hover:text-slate-900 transition-colors duration-200">
              {link.icon}
              {link.name}
              {link.beta && <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-gray-100/70 border">Beta</span>}
            </a>
          ))}
        </div>

        {/* Right: Sign In Button */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex px-6 py-2 items-center gap-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition">
            <User size={14} />
            Sign In
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition" aria-label="Toggle menu">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden px-6 pb-4 border-t border-gray-200/60 bg-white/70 backdrop-blur-xl">
          <div className="flex flex-col space-y-4 pt-4 text-sm font-medium">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="flex items-center gap-2 text-gray-600 hover:text-slate-900 transition-colors duration-200">
                {link.icon}
                {link.name}
                {link.beta && <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-gray-100/70 border">Beta</span>}
              </a>
            ))}
            <button className="sm:hidden w-full mt-2 px-6 py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition">
              <User size={14} />
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}