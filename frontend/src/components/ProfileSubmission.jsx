import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts";
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
  TrendingUp,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { useSubmissionStore } from "../store/useSubmissionStore";


import { useStreakStore } from "../store/useStreakStore";
import useThemeStore from "../store/useThemeStore";
const ProfileSubmission = () => {
  const { submissions, getAllSubmissions } = useSubmissionStore();
  const [expandedSubmission, setExpandedSubmission] = useState(null);
  const [filter, setFilter] = useState("all");
  const {streakData, getStreakData} = useStreakStore();
  const {theme} = useThemeStore();

  const isDark  = theme === "dark";


  useEffect(() => {
    getAllSubmissions();
    getStreakData();
  }, [getAllSubmissions]);

 const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Wrong Answer":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Time Limit Exceeded":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
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
    setExpandedSubmission(expandedSubmission === id ? null : id);
  };


  const filteredSubmissions = submissions.filter((submission) => {
    if (filter === "all") return true;
    return submission.status === filter;
  });

    const statusData = [
    {
      name: "Accepted",
      value: submissions.filter(s => s.status === "Accepted").length,
      color: "#10b981"
    },
    {
      name: "Wrong Answer",
      value: submissions.filter(s => s.status === "Wrong Answer").length,
      color: "#ef4444"
    },
    {
      name: "Time Limit Exceeded",
      value: submissions.filter(s => s.status === "Time Limit Exceeded").length,
      color: "#f59e0b"
    }
  ];





   const languageData = Object.entries(
    submissions.reduce((acc, submission) => {
      acc[submission.language] = (acc[submission.language] || 0) + 1;
      return acc;
    }, {})
  ).map(([language, count]) => ({
    language,
    count,
    percentage: ((count / submissions.length) * 100).toFixed(1)
  }));

  const dailySubmissions = streakData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count
  }));

  const successRate = submissions.length > 0 
    ? Math.round((submissions.filter(s => s.status === "Accepted").length / submissions.length) * 100)
    : 0;

  const successRateData = [
    { name: 'Success', value: successRate, fill: '#10b981' },
    { name: 'Remaining', value: 100 - successRate, fill: isDark ? '#374151' : '#e5e7eb' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };


    const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text ">
            Submission Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track your coding progress with visual insights</p>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{submissions.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Accepted</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {submissions.filter(s => s.status === "Accepted").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{successRate}%</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Current Streak</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{streakData.length}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Success Rate Radial Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Success Rate
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={successRateData}>
                  <RadialBar dataKey="value" fill="#10b981" />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900 dark:fill-white text-2xl font-bold">
                    {successRate}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Status Distribution Pie Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Submission Status
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Language Usage Bar Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Language Usage
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={languageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="language" 
                    tick={{ fill: isDark ? '#d1d5db' : '#374151' }}
                    axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
                  />
                  <YAxis 
                    tick={{ fill: isDark ? '#d1d5db' : '#374151' }}
                    axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Daily Activity Line Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Activity
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySubmissions}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: isDark ? '#d1d5db' : '#374151' }}
                    axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
                  />
                  <YAxis 
                    tick={{ fill: isDark ? '#d1d5db' : '#374151' }}
                    axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          
        </div>

        {/* Submissions List */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Submissions</h2>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Submissions</option>
                <option value="Accepted">Accepted</option>
                <option value="Wrong Answer">Wrong Answer</option>
                <option value="Time Limit Exceeded">Time Limit Exceeded</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-300"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(submission.id)}
                >
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(submission.status)}`}>
                      {submission.status}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">{submission.language}</span>
                    <span className="text-gray-500 dark:text-gray-500 text-sm">
                      {formatDate(submission.createdAt)}
                    </span>
                  </div>
                  {expandedSubmission === submission.id ? <ChevronUp /> : <ChevronDown />}
                </div>

                {expandedSubmission === submission.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                  >
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Source Code</h4>
                      <SyntaxHighlighter
                        language={submission.language.toLowerCase()}
                        style={isDark ? atomOneDark : atomOneLight}
                        className="rounded-lg"
                      >
                        {submission.sourceCode}
                      </SyntaxHighlighter>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Input</h4>
                        <SyntaxHighlighter
                          language="text"
                          style={isDark ? atomOneDark : atomOneLight}
                          className="rounded-lg"
                        >
                          {submission.stdin || "No input provided"}
                        </SyntaxHighlighter>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Output</h4>
                        <SyntaxHighlighter
                          language="text"
                          style={isDark ? atomOneDark : atomOneLight}
                          className="rounded-lg"
                        >
                          {submission.stdout ? JSON.parse(submission.stdout).join("\n") : "No output"}
                        </SyntaxHighlighter>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {Array.isArray(JSON.parse(submission.time)) 
                            ? JSON.parse(submission.time)[0] 
                            : submission.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {Array.isArray(JSON.parse(submission.memory)) 
                            ? JSON.parse(submission.memory)[0] 
                            : submission.memory}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileSubmission;
