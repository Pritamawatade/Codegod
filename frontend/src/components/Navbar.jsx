import React, { useState } from "react";
import {
  User,
  Code,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  Settings,
  Bell,
  LogIn,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";
import RecentSubmissionsPopup from "./RecentSubmissionsPopup";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { useEffect } from "react";
// Mock data and hooks for demonstration - replace with your actual implementations

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { submissions, getAllSubmissions } = useSubmissionStore();
  const [showPopup, setShowPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getAllSubmissions();
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleNotificationClick = () => {
    setShowPopup(true);
  };
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative p-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl group-hover:scale-105 transition-transform duration-200">
                <img src="/codegod.png" className="h-6 w-6" alt="CodeGod" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent tracking-tight hidden sm:block">
                CodeGod
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                to="/problems"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200"
              >
                Problems
              </Link>
              <Link
                to="/sheets"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200"
              >
                Sheets
              </Link>
              <Link
                to="/terms"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200"
              >
                Terms
              </Link>

              <Link
                to="/privacy"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200"
              >
                Privacy
              </Link>
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Notifications */}
              <div>
               
                <button
                  onClick={handleNotificationClick}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 relative"
                >
                  <Bell className="w-5 h-5" />
                </button>
                {showPopup && (
                  <RecentSubmissionsPopup
                    submissions={submissions}
                    onClose={() => setShowPopup(false)}
                  />
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={
                        authUser?.image ||
                        "https://avatar.iran.liara.run/public/boy"
                      }
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {authUser?.name?.charAt(0)?.toUpperCase() +
                        authUser?.name?.slice(1) || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {authUser?.role?.toLowerCase()}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            authUser?.image ||
                            "https://avatar.iran.liara.run/public/boy"
                          }
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {authUser?.name?.charAt(0)?.toUpperCase() +
                              authUser?.name?.slice(1) || "User"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {authUser?.email}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mt-1">
                            {authUser?.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={closeMenus}
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>My Profile</span>
                      </Link>

                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors w-full"
                      >
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span>Settings</span>
                      </button>

                      {isOpen && (
                        <div className="fixed top-60 inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/50">
                          <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 w-[90%] max-w-md rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 transition-all">
                            {/* Close button */}
                            <button
                              onClick={() => setIsOpen(false)}
                              className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-red-500"
                            >
                              <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-semibold mb-4">
                              Keyboard Shortcuts
                            </h2>

                            <ul className="space-y-3 text-sm">
                              <li className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <span>Run Code</span>
                                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 text-sm rounded border dark:border-gray-600 border-gray-300 shadow-sm">
                                  Ctrl + '
                                </kbd>
                              </li>
                              <li className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                                <span>Submit Code</span>
                                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 text-sm rounded border dark:border-gray-600 border-gray-300 shadow-sm">
                                  Ctrl + Enter
                                </kbd>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {authUser?.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          onClick={closeMenus}
                        >
                          <Code className="w-4 h-4 text-gray-400" />
                          <span>Admin dashboard</span>
                          <span className="ml-auto px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-xs font-medium">
                            Admin
                          </span>
                        </Link>
                      )}

                      <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors w-full"
                      >
                        {theme === "dark" ? (
                          <Sun className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Moon className="w-4 h-4 text-gray-400" />
                        )}
                        <span>
                          {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                      {authUser ? (
                        <LogoutButton
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                          onClick={closeMenus}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </LogoutButton>
                      ) : (
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors w-full"
                          onClick={closeMenus}
                        >
                          <LogIn className="w-4 h-4" />

                          <span>Sign In</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={closeMenus}
        >
          <div
            className="fixed top-16 right-0 left-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-6">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="relative">
                  <img
                    src={
                      authUser?.image ||
                      "https://avatar.iran.liara.run/public/boy"
                    }
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                    {authUser?.name?.charAt(0)?.toUpperCase() +
                      authUser?.name?.slice(1) || "User"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {authUser?.email}
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">
                  Navigation
                </h3>
                <Link
                  to="/problems"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
                  onClick={closeMenus}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Problems</span>
                </Link>
                <Link
                  to="/sheets"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
                  onClick={closeMenus}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Sheets</span>
                </Link>
                <Link
                  to="/learn"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
                  onClick={closeMenus}
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">Learn</span>
                </Link>
              </div>

              {/* User Actions */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">
                  Account
                </h3>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
                  onClick={closeMenus}
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">My Profile</span>
                </Link>

                {authUser?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
                    onClick={closeMenus}
                  >
                    <Code className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Admin dashboard</span>
                    <span className="ml-auto px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-md text-xs font-medium">
                      Admin
                    </span>
                  </Link>
                )}

                <LogoutButton
                  className="flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors w-full"
                  onClick={closeMenus}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </LogoutButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-30" onClick={closeMenus} />
      )}
    </>
  );
};

export default Navbar;
