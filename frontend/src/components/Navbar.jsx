import React, { useEffect, useState } from "react";
import { User, Code, LogOut, Menu, X, Moon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import useThemeStore from "../store/useThemeStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {theme, toggleTheme} = useThemeStore();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1">
              <img
                src="https://as1.ftcdn.net/v2/jpg/05/59/94/64/1000_F_559946464_4trpxDuJWn7XePNqLbAQDv2V8f4vwPne.jpg"
                className="h-8 w-8"
                alt="Leetlab"
              />
            </div>
            <span className="text-xl font-bold dark:text-white text-blue-600 hover:text-gray-200 tracking-tight hidden md:block">
              Leetlab
            </span>
          </Link>

          {/* Navigation Links - Add these if needed */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/problems"
              className="text-gray-700 dark:text-gray-50 hover:text-gray-500 px-3 py-2 text-sm font-medium"
            >
              Problems
            </Link>
            <Link
              to="/contests"
              className="text-gray-700 dark:text-gray-50 hover:text-gray-500 px-3 py-2 text-sm font-medium"
            >
              Contests
            </Link>
            <Link
              to="/learn"
              className="text-gray-700 dark:text-gray-50 hover:text-gray-500 px-3 py-2 text-sm font-medium"
            >
              Learn
            </Link>
          </div>

          {/* Desktop User Profile */}
          <div className="hidden md:flex items-center">
            {/* User Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={
                      authUser?.image ||
                      "https://avatar.iran.liara.run/public/boy"
                    }
                    alt="User Avatar"
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-50 hover:text-gray-200 ">
                  {authUser?.name?.charAt(0)?.toUpperCase() +
                    authUser?.name?.slice(1) || "User"}
                </span>
              </label>

              <ul
                tabIndex={0}
                className="menu dropdown-content mt-2 z-[1] p-4 shadow-lg rounded-md w-60  space-y-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col items-start gap-1"
              >
                <li className="mb-1 overflow-hidden">
                  <div className="px-2 py-1 text-gray-700 dark:text-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold">
                        {authUser?.name?.charAt(0)?.toUpperCase() +
                          authUser?.name?.slice(1) || "User"}
                      </p>
                      <p className="text-xs opacity-70">{authUser?.email}</p>
                    </div>
                  </div>
                </li>

                <li>
                  <Link
                    to="/profile"
                    className="overflow-hidden flex items-center px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span>My Profile</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={toggleTheme}
                    className="overflow-hidden flex items-center px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-50"
                  >
                    <Moon className="w-4 h-8 mr-2" />
                    <span className="gap-2 capitalize text-md">
                      {theme === "dark" ? "Switch to light" : "Switch to dark"}
                    </span>
                  </button>
                </li>

                {authUser?.role === "ADMIN" && (
                  <li>
                    <Link
                      to="/add-problem"
                      className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-50"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      <span>Add Problem</span>
                    </Link>
                  </li>
                )}

                <li>
                  <LogoutButton className="flex items-center px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-500 transition-colors duration-200 w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </LogoutButton>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-16 right-0 left-0 bg-white border-b border-gray-200 shadow-md z-50">
                <div className="max-w-screen-2xl mx-auto px-4 py-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={
                          authUser?.image ||
                          "https://avatar.iran.liara.run/public/boy"
                        }
                        alt="User Avatar"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {authUser?.name?.charAt(0)?.toUpperCase() +
                          authUser?.name?.slice(1) || "User"}
                      </p>
                      <p className="text-xs text-gray-500">{authUser?.email}</p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                    <Link
                      to="/problems"
                      className="flex items-center px-2 py-3 text-gray-700  hover:text-gray-600 rounded-md dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Problems
                    </Link>
                    <Link
                      to="/contests"
                      className="flex items-center px-2 py-3 text-gray-700  hover:text-gray-600 rounded-md dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Contests
                    </Link>
                    <Link
                      to="/learn"
                      className="flex items-center px-2 py-3 text-gray-700  hover:text-gray-600 rounded-md dark:text-gray-300 dark:hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Learn
                    </Link>
                  </div>

                  {/* User Actions */}
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/profile"
                        className="flex items-center px-2 py-3 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
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
                          className="flex items-center px-2 py-3 rounded-md hover:bg-gray-50 transition-colors text-gray-700"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Code className="w-4 h-4 mr-2" />
                          <span>Add Problem</span>
                        </Link>
                      </li>
                    )}

                    <li>
                      <LogoutButton
                        className="flex items-center px-2 py-3 rounded-md w-full hover:bg-red-50 text-red-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        <span>Logout</span>
                      </LogoutButton>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
