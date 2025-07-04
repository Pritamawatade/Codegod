import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const BannerText = ({ title, description, buttonText }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center  dark:bg-gray-900 bg-gray-300 ">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className=" bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 dark:bg-slate-900 rounded-4xl p-8 md:p-4 max-w-6xl mx-auto  text-center overflow-hidden relative "
      >
        {/* Decorative dotted line (optional, adjust as needed) */}
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-48 h-48">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 0C100 55.2285 55.2285 100 0 100"
              stroke="rgba(147, 197, 253, 0.5)"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
          </svg>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-black capitalize  leading-tight p-20"
        >
          {/* Scrape Anything from <span className="block sm:inline">LinkedIn, without limits.</span> */}
          <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 capitalize dark:text-white leading-tight p-4">
            Level up from mortal to God
          </span>
          One problem{" "}
          <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-black  mb-6 leading-tight">
            at a time.
          </p>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-lg sm:text-xl text-slate-700 dark:text-slate-700 mb-10 max-w-2xl mx-auto"
        >
          {/* A streamlined LinkedIn scraper API for real-time data scraping of profiles and company information at scale. */}
          Track your growth, crush your weaknesses, and become unstoppable.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onClick={()=> navigate('/problems')}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md transition-colors duration-300"
        >
          {buttonText}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default BannerText;
