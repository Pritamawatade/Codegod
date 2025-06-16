import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from "lucide-react";

const SubmissionResults = ({ submission }) => {
  const passedTests = submission?.filter((tc) => tc.passed).length;
  const totalTests = submission?.length || 3;

  const [selectedTest, setSelectedTest] = useState(0);


  return (
    <div className="space-y-6">
      {/* Test Cases Results */}
      <div className="card bg-gray-100 dark:bg-gray-900 shadow-xl dark:shadow-lg dark:shadow-gray-900 shadow-gray-500">
        <div className="card-body">
          <h2 className="card-title mb-4 text-gray-700 dark:text-gray-300">
            Test Cases Results
          </h2>
          
          {/* Test Case Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {submission?.map((testCase, index) => (
              <button
                key={testCase.id}
                onClick={() => setSelectedTest(index)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                  ${testCase.passed 
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800' 
                    : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
                  }`}
              >
                {testCase.passed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Test Case {index + 1}
              </button>
            ))}
          </div>

          {/* Selected Test Case Details */}
          {selectedTest !== null && submission?.[selectedTest] && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Status:</span>
                {submission[selectedTest].passed ? (
                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Passed
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    Failed
                  </span>
                )}
              </div>
              
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Expected Output: </span>
                <code className="font-mono text-gray-700 dark:text-gray-300">{submission[selectedTest].expected}</code>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Your Output: </span>
                <code className="font-mono text-gray-700 dark:text-gray-300">{submission[selectedTest].stdout || "null"}</code>
              </div>
              
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Memory className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{submission[selectedTest].memory}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{submission[selectedTest].time}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
