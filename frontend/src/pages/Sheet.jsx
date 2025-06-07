import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Trophy, ArrowRight, CheckCircle2 } from "lucide-react";
import useSheetStore from "../store/useSheetStore";
import { useParams, Link } from "react-router-dom";



function Sheet() {
  const { sheet, getSheet, loading, getProgress, progress } = useSheetStore();
  const { id } = useParams();

  useEffect(() => {
    getSheet(id);
    getProgress(id);
  }, [id]);

  if (loading || !sheet) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading sheet...</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
      case "HARD":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
    }
  };

  const progressPercentage = progress ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden"
        >
          <div className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Problem Sheet
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {sheet.title}
                </h1>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-2xl">
                  {sheet.description}
                </p>
                
                {/* Stats Row */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {sheet._count?.problems || 0} Problems
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    sheet.price === 0
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                  }`}>
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {sheet.price === 0 ? "Free" : `₹${sheet.price}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content - Progress */}
              {progress && (
                <div className="lg:w-80">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Progress
                      </h3>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {progressPercentage}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-4">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {progress.completed} of {progress.total} completed
                      </span>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {progress.completed}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Problems Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="px-6 sm:px-8 lg:px-12 py-8">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Problems
              </h2>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                {sheet.problems?.length || 0}
              </span>
            </div>

            {sheet.problems && sheet.problems.length > 0 ? (
              <div className="space-y-4">
                {sheet.problems.map((problem, i) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="group bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:bg-white dark:hover:bg-gray-700/50 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      
                      {/* Left Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {problem.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {problem.description}
                        </p>
                        
                        {problem.tags && problem.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {problem.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Content */}
                      <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        
                        <Link
                          to={`/problem/${problem.id}`}
                          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 group/btn"
                        >
                          <span>Solve</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No problems found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This sheet doesn't contain any problems yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Sheet;