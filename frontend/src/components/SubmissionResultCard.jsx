import React from "react";
import { CheckCircle, XCircle, TimerIcon, Code2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SubmissionResultCard({ submission }) {
  const totalPassed = submission.testcaseresult.filter(tc => tc.passed).length;
  const totalCases = submission.testcaseresult.length;
  const statusColor = submission.status === "Accepted" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto border border-zinc-200 dark:border-zinc-700"
    >
      <div className="flex flex-col gap-4">
        {/* Submission Summary */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Submission Result</h2>
          <span className={`text-sm font-medium ${statusColor}`}>{submission.status}</span>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <div>
            <span className="font-medium">Language:</span> {submission.language}
          </div>
          <div>
            <span className="font-medium">Submitted:</span> {new Date(submission.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Test Cases Passed:</span> {totalPassed}/{totalCases}
          </div>
          <div>
            <span className="font-medium">Avg. Time:</span> {
              submission.testcaseresult.length > 0 ?
              (submission.testcaseresult.reduce((sum, tc) => sum + parseFloat(tc.time), 0) / totalCases).toFixed(3) + ' ms' :
              'N/A'
            }
          </div>
        </div>

        {/* Test Case Results */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2 text-zinc-800 dark:text-zinc-100">Test Case Results</h3>
          <div className="space-y-3">
            {submission.testcaseresult.map(tc => (
              <div
                key={tc.id}
                className="border border-zinc-200 dark:border-zinc-700 rounded-md p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                <div className="flex items-center gap-2 text-sm">
                  {tc.passed ? (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-500 w-5 h-5" />
                  )}
                  <span className="text-zinc-800 dark:text-zinc-100">Test Case #{tc.testCase}</span>
                </div>
                <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                  <div>Expected: <code className="text-zinc-800 dark:text-zinc-100">{tc.expected}</code></div>
                  <div>Output: <code className="text-zinc-800 dark:text-zinc-100">{tc.stdout}</code></div>
                  <div className="flex gap-3 mt-1">
                    <div className="flex items-center gap-1"><TimerIcon className="w-4 h-4" /> {tc.time}</div>
                    <div className="flex items-center gap-1"><Code2 className="w-4 h-4" /> {tc.memory}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
