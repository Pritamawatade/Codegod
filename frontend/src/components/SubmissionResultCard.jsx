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
      className="w-full"
    >
      {/* Status Header */}
      <div className="flex items-center gap-4 mb-6 px-4">
        {submission.status === "Accepted" ? (
          <CheckCircle className="w-8 h-8 text-green-500" />
        ) : (
          <XCircle className="w-8 h-8 text-red-500" />
        )}
        <div>
          <h2 className={clsx(
            "text-2xl font-medium",
            submission.status === "Accepted" ? "text-green-500" : "text-red-500"
          )}>
            {submission.status}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            {totalPassed} / {totalCases} test cases passed
          </p>
        </div>
      </div>

      {/* Submission Details */}
      <div className="border-y border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
        <div className="grid grid-cols-4 text-sm">
          <div className="p-4 border-r border-zinc-200 dark:border-zinc-700">
            <div className="text-zinc-500 dark:text-zinc-400">Runtime</div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">{avgTime} ms</div>
          </div>
          <div className="p-4 border-r border-zinc-200 dark:border-zinc-700">
            <div className="text-zinc-500 dark:text-zinc-400">Memory</div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {submission.testcaseresult[0]?.memory || "N/A"}
            </div>
          </div>
          <div className="p-4 border-r border-zinc-200 dark:border-zinc-700">
            <div className="text-zinc-500 dark:text-zinc-400">Language</div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">{submission.language}</div>
          </div>
          <div className="p-4">
            <div className="text-zinc-500 dark:text-zinc-400">Submitted</div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {new Date(submission.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Test Cases</h3>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            {totalPassed} passed, {totalCases - totalPassed} failed
          </div>
        </div>

        <div className="space-y-2">
          {submission.testcaseresult.map((tc, index) => (
            <div
              key={tc.id}
              className="px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {tc.passed ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Test Case {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{tc.time} ms</span>
                  <span>{tc.memory}</span>
                </div>
              </div>

              <div className="pl-6 text-sm space-y-1">
                <div className="text-zinc-600 dark:text-zinc-300">
                  <span className="text-zinc-400 dark:text-zinc-500">Input:</span>{" "}
                  <code className="font-mono">{tc.expected}</code>
                </div>
                <div className="text-zinc-600 dark:text-zinc-300">
                  <span className="text-zinc-400 dark:text-zinc-500">Output:</span>{" "}
                  <code className="font-mono">{tc.stdout}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
