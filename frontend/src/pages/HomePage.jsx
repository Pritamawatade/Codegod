import React, { useEffect } from "react";

import useProblemStore from "../store/useProblemStore";
import { Loader } from "lucide-react";
import ProblemTable from "../components/ProblemTable";
import { useActionStore } from "../store/useActionStore";

function HomePage() {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const { isDeletingProblem } = useActionStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems, isDeletingProblem]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-[#0a0a0a] dark:via-[#0e0e0e] dark:to-[#0a0a0a]">
      {/* Hero Section with Geometric Background */}
      <div className="relative overflow-hidden">
        {/* Geometric Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-20"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Content */}
            <div className="text-center mb-16">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium mb-6 border border-blue-200 dark:border-blue-800">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                Transform Your Coding Journey
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                  Become CodeGod
                </span>
                <br />
                <span className="text-gray-700 dark:text-gray-300 text-3xl sm:text-4xl lg:text-5xl">
                  in 30 days
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
                Master coding interviews with our comprehensive platform.
                Practice problems, track progress, and build the skills that top
                tech companies value most.
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
                <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    500+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Problems
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    10+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Solved Daily
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    95%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Problems Content */}
            <div className="relative">
              {problems.length > 0 ? (
                <div>
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Practice Problems
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Choose from our curated collection of coding challenges
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="hidden sm:flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {problems.length}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Total Problems
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Problems Table Container */}
                  <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
                    <ProblemTable problems={problems} />
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16">
                  <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 max-w-md mx-auto">
                    {/* Empty State Icon */}
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      No Problems Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      We're working hard to bring you the best coding
                      challenges. Check back soon for new problems!
                    </p>

                    {/* Action Button */}
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Refresh Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="h-32 bg-gradient-to-t from-white to-transparent dark:from-[#0e0e0e] dark:to-transparent"></div>
    </div>
  );
}

export default HomePage;
