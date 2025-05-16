
import React, { useState, useEffect } from "react"
import { User, Code, LogOut, Sun, Moon, Menu, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check system preference for dark/light mode on mount
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
    console.log("line 27 authuser",authUser?.user?.role)
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full py-3">
      <div className={`flex w-full justify-between mx-auto max-w-4xl ${isDarkMode ? 'bg-gray-900/90' : 'bg-white/90'} shadow-lg backdrop-blur-lg border ${isDarkMode ? 'border-gray-700/30' : 'border-gray-200/30'} p-3 rounded-xl transition-all duration-300`}>
        {/* Logo Section */}
        <Link 
          to="/" 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className={`p-2 rounded-full ${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} transition-all duration-300 group-hover:scale-105`}>
            <img src="/leetlab.svg" className="h-6 w-6" alt="Leetlab" />
          </div>
          <span className={`text-lg md:text-xl font-bold tracking-tight hidden md:block ${isDarkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-300`}>
            Leetlab
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <label 
              tabIndex={0} 
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-all duration-300`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/70">
                <img
                  src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                  alt="User Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {authUser?.name?.split(' ')[0] || "User"}
              </span>
            </label>
            
            <ul
              tabIndex={0}
              className={`menu dropdown-content mt-3 z-[1] p-3 shadow-lg rounded-xl w-56 space-y-1 ${isDarkMode ? 'bg-gray-900 text-gray-200 border border-gray-700/50' : 'bg-white text-gray-700 border border-gray-200/50'}`}
            >
              <li className="mb-2">
                <div className={`px-2 py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <p className="text-base font-semibold">
                    {authUser?.name}
                  </p>
                  <p className="text-xs opacity-70">{authUser?.email}</p>
                </div>
                <hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-200'} my-1`} />
              </li>
              
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors duration-200`}
                >
                  <User className="w-4 h-4 mr-2" />
                  <span>My Profile</span>
                </Link>
              </li>
              
              {authUser?.user?.role === "ADMIN" && (
                <li>
                  <Link
                    to="/add-problem"
                    className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors duration-200`}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    <span>Add Problem</span>
                  </Link>
                </li>
              )}
              
              <li>
                <LogoutButton className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'} transition-colors duration-200 w-full`}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </LogoutButton>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
            ) : (
              <Menu className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
            )}
          </button>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className={`absolute top-16 right-4 p-3 rounded-xl shadow-lg w-64 ${isDarkMode ? 'bg-gray-900 border border-gray-700/50' : 'bg-white border border-gray-200/50'} z-50`}>
              <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-200/20">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/70">
                  <img
                    src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                    alt="User Avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {authUser?.name}
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {authUser?.email}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/profile"
                    className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>My Profile</span>
                  </Link>
                </li>
                
                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      <span>Add Problem</span>
                    </Link>
                  </li>
                )}
                
                <li>
                  <LogoutButton 
                    className={`flex items-center px-3 py-2 rounded-lg w-full ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'} transition-colors duration-200`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </LogoutButton>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;