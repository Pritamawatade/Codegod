import React, { useEffect, useState } from "react";
import { useSubmissionStore } from "../store/useSubmissionStore";
import {
  Code,
  Terminal,
  Clock,
  HardDrive,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
const ProfileSubmission = () => {
  const { submissions, getAllSubmissions } = useSubmissionStore();
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllSubmissions();
  }, [getAllSubmissions]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-success text-success-content";
      case "Wrong Answer":
        return "bg-error text-error-content";
      case "Time Limit Exceeded":
        return "bg-warning text-warning-content";
      default:
        return "bg-info text-info-content";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const toggleExpand = (id) => {
    if (expandedSubmission === id) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(id);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (filter === "all") return true;
    return submission.status === filter;
  });

  return (
    <div className="n border dark:border-[#3a3a40] p-4 md:p-8 bg-gray-100 w-full dark:bg-[#0b1018]">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4 md:mb-0">
            My Submissions
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline gap-2">
                <Filter size={16} />
                {filter === "all" ? "All Submissions" : filter}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <button onClick={() => setFilter("all")}>
                    All Submissions
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilter("Accepted")}>
                    Accepted
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilter("Wrong Answer")}>
                    Wrong Answer
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilter("Time Limit Exceeded")}>
                    Time Limit Exceeded
                  </button>
                </li>
              </ul>
            </div>

            <div className="stats shadow bg-gray-100 dark:bg-gray-800 space-x-2">
              <div className="stat px-4 py-2">
                <div className="stat-title text-black dark:text-white">Total</div>
                <div className="stat-value text-primary dark:text-white text-lg">
                  {submissions.length}
                </div>
              </div>
              <div className="stat px-4 py-2">
                <div className="stat-title text-black dark:text-white">Accepted</div>
                <div className="stat-value text-lg text-success">
                  {submissions.filter((s) => s.status === "Accepted").length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="card  shadow-xl bg-gray-100 dark:bg-gray-800">
            <div className="card-body items-center text-center">
              <h2 className="card-title">No submissions found</h2>
              <p className="text-black dark:text-white">
                You haven't submitted any solutions yet, or none match your
                current filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="card bg-gray-100 dark:bg-gray-800 shadow-xl overflow-hidden transition-all duration-300"
              >
                <div
                  className="card-body p-0"
                  role="button"
                  onClick={() => toggleExpand(submission.id)}
                >
                  {/* Submission Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 cursor-pointer  dark:hover:bg-gray-800">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 w-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`badge badge-lg ${getStatusClass(
                          submission.status
                        )} dark:bg-gray-700 dark:text-gray-300`}
                      >
                        {submission.status === "Accepted" ? (
                          <Check size={14} className="mr-1" />
                        ) : null}
                        {submission.status}
                      </div>

                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded  ">
                        <Code size={16} className="dark:text-gray-300" />
                        <span className="font-medium dark:text-gray-300">
                          {submission.language}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={16} className="dark:text-gray-300" />
                        <span className="dark:text-gray-300">
                          Submitted {formatDate(submission.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 md:mt-0">
                      {expandedSubmission === submission.id ? (
                        <ChevronUp size={20} className="dark:text-gray-300" />
                      ) : (
                        <ChevronDown size={20} className="dark:text-gray-300" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedSubmission === submission.id && (
                    <div className="border-t border-base-300">
                      {/* Code Section */}

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                          <Code size={18} />
                          Solution Code
                        </h3>
                        <SyntaxHighlighter
                          language={submission.language.toLowerCase()}
                          style={atomOneDark}
                        >
                          {submission.sourceCode}
                        </SyntaxHighlighter>
                      </div>
                      {/* Input/Output Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t dark:border-3a3a40 border-base-300">
                        <div>
                          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Terminal size={18} />
                            Input
                          </h3>
                          <div className="mockup-code dark:bg-[#0b1018] bg-gray-100 text-neutral-content">                            <SyntaxHighlighter
                              language="python"
                              style={atomOneDark}
                            >
                              {
                              submission.stdin ? 
                              `${"\n" + submission.stdin.trim()}` :
                              "No input provided"
                              }
                            </SyntaxHighlighter>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Terminal size={18} />
                            Output
                          </h3>
                          <div className="mockup-code dark:bg-[#0b1018] bg-gray-100 text-neutral-content">
                            <SyntaxHighlighter
                              language="python"
                              className="dark:bg-[#0b1018]"
                              style={atomOneDark}
                            >
                              {/* {Array.isArray(JSON.parse(submission.stdout))
                                ? JSON.parse(submission.stdout).join("")
                                : submission.stdout || "No output"} */}

                                 {
                              submission.stdout ? 
                              `${"\n" + JSON.parse(submission.stdout).join("\n")}` :
                              "No out provided"
                              }
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      </div>

                      {/* Performance Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border-t border-base-300">
                        <div className="stats shadow">
                          <div className="stat">
                            <div className="stat-figure text-primary">
                              <Clock size={24} />
                            </div>
                            <div className="stat-title text-gray-900 dark:text-white">Execution Time</div>
                            <div className="stat-value text-lg">
                              {Array.isArray(JSON.parse(submission.time))
                                ? JSON.parse(submission.time)[0]
                                : submission.time || "N/A"}
                            </div>
                          </div>
                        </div>

                        <div className="stats shadow">
                          <div className="stat">
                            <div className="stat-figure text-primary">
                              <HardDrive size={24} />
                            </div>
                            <div className="stat-title text-gray-900 dark:text-white">Memory Used</div>
                            <div className="stat-value text-lg">
                              {Array.isArray(JSON.parse(submission.memory))
                                ? JSON.parse(submission.memory)[0]
                                : submission.memory || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSubmission;
