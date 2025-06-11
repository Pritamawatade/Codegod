import React from "react";
import { CheckCircle, XCircle, TimerIcon, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function SubmissionResultCard({ submission }) {
  const totalPassed = submission.testcaseresult.filter(tc => tc.passed).length;
  const totalCases = submission.testcaseresult.length;
  const avgTime = totalCases > 0
    ? (submission.testcaseresult.reduce((sum, tc) => sum + parseFloat(tc.time), 0) / totalCases).toFixed(3)
    : "N/A";

  const statusColorMap = {
    Accepted: "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-300",
    Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-300"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-sm w-full max-w-4xl mx-auto p-5"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Submission Report
        </h2>
        <span
          className={clsx(
            "px-3 py-1 text-sm font-medium rounded-full capitalize",
            statusColorMap[submission.status] || "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100"
          )}
        >
          {submission.status}
        </span>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-5 text-zinc-700 dark:text-zinc-300">
        <div><span className="font-medium">Language:</span> {submission.language}</div>
        <div><span className="font-medium">Submitted:</span> {new Date(submission.createdAt).toLocaleString()}</div>
        <div><span className="font-medium">Passed:</span> {totalPassed}/{totalCases}</div>
        <div><span className="font-medium">Avg Time:</span> {avgTime} ms</div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 mb-4" />

      {/* Test Case Section */}
      <div>
        <h3 className="text-md sm:text-lg font-medium mb-3 text-zinc-800 dark:text-zinc-100">
          Test Case Details
        </h3>

        <div className="space-y-3">
          {submission.testcaseresult.map((tc, index) => (
            <div
              key={tc.id}
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 bg-zinc-50 dark:bg-zinc-800/40"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {tc.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  Test Case #{tc.testCase}
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-1">
                    <TimerIcon className="w-4 h-4" /> {tc.time} ms
                  </div>
                  <div className="flex items-center gap-1">
                    <Code2 className="w-4 h-4" /> {tc.memory}
                  </div>
                </div>
              </div>

              <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                <div>
                  <span className="font-medium">Expected:</span>{" "}
                  <code className="text-zinc-900 dark:text-zinc-100">{tc.expected}</code>
                </div>
                <div>
                  <span className="font-medium">Output:</span>{" "}
                  <code className="text-zinc-900 dark:text-zinc-100">{tc.stdout}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
