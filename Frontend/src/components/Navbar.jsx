import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useTheme } from "../context/ThemeContext";   // ← change this path if your folder is different

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  // ← DEBUG LOGS (you will see these in console)
  console.log("Navbar rendered - Current theme from context:", theme);

  const handleToggle = () => {
    console.log("🌗 Button clicked! Current theme before toggle:", theme);
    toggleTheme();
  };

  return (
    <header className="fixed w-full z-50 backdrop-blur-xl bg-white/60 dark:bg-black/40 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="University Logo"
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            Smart University Booking System
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <NavLink to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
            Home
          </NavLink>
          <NavLink to="/register" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
            Register
          </NavLink>
          <NavLink to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
            Login
          </NavLink>

          {/* THEME BUTTON WITH DEBUG */}
          <button
            onClick={handleToggle}
            className="text-2xl hover:scale-125 transition-transform p-2"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
};