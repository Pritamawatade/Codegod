import { Code, Github, Linkedin, Mail, Twitter } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-black dark:text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-1 md:col-span-2"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center transform rotate-12">
                <Code className="w-6 h-6 dark:text-white" />
              </div>
              <span className="text-3xl font-bold dark:text-white text-black bg-clip-text ">
                CodeGod
              </span>
            </div>
            <p className="text-black dark:text-white mb-6 max-w-md">
              Elevate your coding skills to divine levels. Master Data
              Structures & Algorithms with the platform trusted by coding
              legends worldwide.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-cyan-700 transition-colors cursor-pointer">
                <Twitter className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer">
                <Github className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <Mail className="w-5 h-5" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Platform
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link
                  to="/problems"
                  className="text-black dark:text-white hover:text-gray-500 transition-colors"
                >
                  Problems
                </Link>
              </li>

              <li>
                <Link
                  to="/"
                  className="text-black dark:text-white hover:text-gray-500 transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="text-black dark:text-white hover:text-gray-500 transition-colors"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Company
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link
                  to="/privacy"
                  className="text-black dark:text-white hover:text-gray-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-black dark:text-white hover:text-gray-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400"
        >
          <p>
            &copy; 2025 CodeGod. All rights reserved. Ascend to coding divinity.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;
