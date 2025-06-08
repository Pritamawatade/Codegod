// frontend/src/components/RecentSubmissionsPopup.jsx
import { X } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

const RecentSubmissionsPopup = ({ submissions, onClose }) => {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-12 right-24 w-[360px] max-h-[80vh] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-xl rounded-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold">Recent Submissions</h2>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto max-h-[calc(80vh-3rem)] px-4 py-2 space-y-4">
        {submissions.length === 0 ? (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            No recent submissions.
          </div>
        ) : (
          submissions.map((submission, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-200">
                <span>Problem: {submission.problemId.split('-')[0]+'...'}</span>
                <span className="text-xs text-gray-500">{submission.language}</span>
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-600 dark:text-gray-400">
                <span>Status: {submission.status}</span>
                <span>Time: {submission.time[0]}ms</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
                <span>Memory: {JSON.parse(submission.memory)[0]}</span>
                <span>{submission.createdAt}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RecentSubmissionsPopup;
