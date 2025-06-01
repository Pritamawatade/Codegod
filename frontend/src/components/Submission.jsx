import React, { useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from "lucide-react";

const SubmissionResults = ({ submission }) => {





  const passedTests = submission?.filter(
    (tc) => tc.passed
  ).length;
  const totalTests = submission?.length || 3;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gray-50 dark:bg-gray-900    shadow-xl dark:shadow-lg dark:shadow-gray-900 ">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-gray-700 dark:text-gray-300">
              Status
            </h3>
            <div
              className={`text-lg font-bold ${
                submission.status === "Accepted" ? "text-success" : "text-error"
              }`}
            >
              {submission.map((tc) => tc.status)}
            </div>
          </div>
        </div>

        <div className="card bg-gray-50 dark:bg-gray-900    shadow-xl dark:shadow-lg dark:shadow-gray-900 ">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-gray-700 dark:text-gray-300">
              Success Rate
            </h3>
            <div className="text-lg font-bold">{successRate.toFixed(1)}%</div>
          </div>
        </div>

        <div className="card dark:bg-gray-900    shadow-xl dark:shadow-lg dark:shadow-gray-900 ">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold">{submission[0].time}</div>
          </div>
        </div>

        <div className="card dark:bg-gray-900    shadow-xl dark:shadow-lg dark:shadow-gray-900">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Memory className="w-4 h-4" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold">{avgMemory.toFixed(0)} KB</div>
          </div>
        </div>
      </div> */}

      {/* Test Cases Results */}
      <div className="card bg-gray-100 dark:bg-gray-900 shadow-xl dark:shadow-lg dark:shadow-gray-900 shadow-gray-500 ">
        <div className="card-body">
          <h2 className="card-title mb-4 text-gray-700 dark:text-gray-300">
            Test Cases Results
          </h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th className="text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-gray-700 dark:text-gray-300">
                    Expected Output
                  </th>
                  <th className="text-gray-700 dark:text-gray-300">
                    Your Output
                  </th>
                  <th className="text-gray-700 dark:text-gray-300">Memory</th>
                  <th className="text-gray-700 dark:text-gray-300">Time</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                {submission?.map((testCase) => (
                  <tr key={testCase.id} className="bg-gray-50 dark:bg-gray-800">
                    <td>
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-success ">
                          <CheckCircle2 className="w-5 h-5" />
                          Passed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-error">
                          <XCircle className="w-5 h-5" />
                          Failed
                        </div>
                      )}
                    </td>
                    <td className="font-mono text-gray-700 dark:text-gray-300">
                      {testCase.expected}
                    </td>
                    <td className="font-mono text-gray-700 dark:text-gray-300">
                      {testCase.stdout || "null"}
                    </td>
                    <td className="text-gray-700 dark:text-gray-300">
                      {testCase.memory}
                    </td>
                    <td className="text-gray-700 dark:text-gray-300">
                      {testCase.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
