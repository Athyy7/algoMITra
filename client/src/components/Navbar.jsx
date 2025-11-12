import React, { useState, useEffect, useContext } from "react";
import { User, Bot, Menu, X, CircleUserRound, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  // 🧠 Smart scroll logic: if not on "/", navigate there with scroll command
  const handleNavClick = (sectionId) => {
    if (location.pathname === "/") {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // When homepage loads, scroll to section if asked
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🧭 Navigation links
  const navLinks = [
    { name: "Problems", id: "problems" },
    { name: "Leaderboard", id: "leaderboard" },
    { name: "Meet MITra", id: "mitra", icon: <Bot size={14} />, beta: true },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-lg bg-white/40 transition-all duration-300 
      ${hasScrolled ? "shadow-md border-b border-gray-200/60" : "border-b border-transparent"}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 font-plusjakarta">
        
        {/* LOGO */}
        <a
          onClick={() => handleNavClick("hero")}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <span className="text-xl font-semibold text-slate-900">&lt;/&gt;</span>
          <div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">algoMITra</span>
            <p className="text-[11px] text-gray-500 -mt-0.5">where bugs become features ✨</p>
          </div>
        </a>

        {/* CENTER LINKS */}
        <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-700">
          {navLinks.map((link) => (
            <a
              key={link.name}
              onClick={() => handleNavClick(link.id)}
              className="relative flex items-center gap-2 text-gray-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
            >
              {link.icon}
              {link.name}
              {link.beta && (
                <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-gray-100/70 border">
                  Beta
                </span>
              )}
            </a>
          ))}
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="hidden sm:flex px-6 py-2 items-center gap-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition"
              >
                <CircleUserRound size={14} />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:flex p-2 items-center rounded-lg bg-gray-200 text-slate-900 text-sm hover:bg-gray-300 transition"
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:flex px-6 py-2 items-center gap-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition"
            >
              <User size={14} />
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="lg:hidden px-6 pb-4 border-t border-gray-200/60 bg-white/70 backdrop-blur-xl">
          <div className="flex flex-col space-y-4 pt-4 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                onClick={() => handleNavClick(link.id)}
                className="flex items-center gap-2 text-gray-600 hover:text-slate-900 transition-colors duration-200 cursor-pointer"
              >
                {link.icon}
                {link.name}
                {link.beta && (
                  <span className="ml-1 px-2 py-0.5 text-[10px] rounded-full bg-gray-100/70 border">
                    Beta
                  </span>
                )}
              </a>
            ))}

            {isAuthenticated ? (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full mt-2 px-6 py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition"
                >
                  <CircleUserRound size={14} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-2 flex items-center justify-center gap-2 rounded-lg bg-gray-200 text-slate-900 text-sm hover:bg-gray-300 transition"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="sm:hidden w-full mt-2 px-6 py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition"
              >
                <User size={14} />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
