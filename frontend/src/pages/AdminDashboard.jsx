import React, { use, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  Code,
  Trophy,
  Activity,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  Filter,
  Download,
  Menu,
  X,
  Sun,
  Moon,
  Settings,
  Bell,
  Search,
  Home,
  FileText,
  UserCheck,
  BarChart3,
  Shield,
  Database,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import useProblemStore from "../store/useProblemStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { all } from "axios";
import useThemeStore from "../store/useThemeStore";
import { Link, Navigate } from "react-router-dom";
import AdminUsersPage from "./AdminUsersPage";
import ProblemTable from "../components/ProblemTable";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { allUsers, getAllUsers } = useAuthStore();
  const { authUser } = useAuthStore();
  const { problems, getAllProblems } = useProblemStore();
  const { getAllSubmissionsForAdmin, allSubmissions } = useSubmissionStore();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    getAllSubmissionsForAdmin();
    getAllUsers();
    getAllProblems();
  }, []);

  if(authUser?.role !== "ADMIN"){
    return <Navigate to="/" />;
  }

  // Sample data for charts
  const userGrowthData = [
    { month: "Jan", users: 1200, problems: 45 },
    { month: "Feb", users: 1890, problems: 52 },
    { month: "Mar", users: 2800, problems: 61 },
    { month: "Apr", users: 3908, problems: 78 },
    { month: "May", users: 4800, problems: 89 },
    { month: "Jun", users: 6200, problems: 95 },
  ];

  const submissionData = [
    {
      name: "Easy",
      value: problems.filter((pb) => pb.difficulty == "EASY").length,
      count: problems.filter((pb) => pb.difficulty == "EASY").length,
    },
    {
      name: "Medium",
      value: problems.filter((pb) => pb.difficulty == "MEDIUM").length,
      count: problems.filter((pb) => pb.difficulty == "MEDIUM").length,
    },
    {
      name: "Hard",
      value: problems.filter((pb) => pb.difficulty == "HARD").length,
      count: problems.filter((pb) => pb.difficulty == "HARD").length,
    },
  ];
  const metaProblems = problems.filter((pb) => pb.companyTags.some((t) => t.toLowerCase() === 'meta'));
  const googleProblems = problems.filter((pb) => pb.companyTags.some((t) => t.toLowerCase() === 'google'));
  const amazonProblems = problems.filter((pb) => pb.companyTags.some((t) => t.toLowerCase() === 'amazon'));
  const appleProblems = problems.filter((pb) => pb.companyTags.some((t) => t.toLowerCase() === 'apple'));
  const microsoftProblems = problems.filter((pb) => pb.companyTags.some((t) => t.toLowerCase() === 'microsoft'));

  const prolblemData = [
    {
      name: "google",
      value: googleProblems.length,
      count:  googleProblems.length,
    },

    {
      name: "microsoft",
      value: microsoftProblems.length,
      count: microsoftProblems.length,
    },

    {
      name: "amazon",
      value: amazonProblems.length,
      count: amazonProblems.length,
    },
    {
      name: "apple",
      value: appleProblems.length,
      count: appleProblems.length,
    },
    {
      name:"meta",
      value: metaProblems.length,
      count: metaProblems.length,
    }
    
  ];


  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const stats = [
    {
      title: "Total Users",
      value: allUsers.length,
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Problems",
      value: problems.length,
      change: "+8%",
      icon: Code,
      color: "bg-green-500",
    },
    {
      title: "Submissions Today",
      value: allSubmissions?.length,
      change: "+23%",
      icon: Activity,
      color: "bg-purple-500",
    },
    {
      title: "Active Users",
      value: allUsers.length,
      change: "+5%",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];



  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
    >
      {/* Sidebar */}
     
      {/* Main Content */}
      <div
        className={`transition-all duration-300`}
      >
        {/* Header */}
      <Navbar />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}

            {/* Submissions by Difficulty */}
            <div className="bg-white   dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Problems by Difficulty
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={submissionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {submissionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

                <div className="bg-white   dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Problems by company
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={prolblemData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {prolblemData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Chart */}
          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Submissions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Submissions
                </h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-scroll">
                {allSubmissions?.length > 0 &&
                  allSubmissions.map((submission, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <img
                            src={submission.user?.image}
                            className="text-white text-sm font-bold"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {submission.user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {submission.Problem.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${
                            submission.status === "Accepted"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {submission.status}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {JSON.parse(submission.time)[0]}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Users */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Top Users
                </h3>
              </div>
              <div
                className="p-4 rounded-lg max-h-[400px] overflow-y-scroll"
                style={{ backgroundColor: "#1e2939" }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Leaderboard
                </h2>
                <div className="space-y-3">
                  {[...allUsers]
                    .sort((a, b) => b.dailyStreak.length - a.dailyStreak.length)
                    .map((user, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          index < 3 ? "border-l-4" : ""
                        }`}
                        style={{
                          backgroundColor: index === 0 ? "#2d3b4e" : "#1e2939",
                          borderLeftColor:
                            index === 0
                              ? "#f59e0b"
                              : index === 1
                              ? "#9ca3af"
                              : index === 2
                              ? "#f97316"
                              : "transparent",
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <span
                              className={`w-6 text-center mr-4 font-bold ${
                                index === 0
                                  ? "text-yellow-400 text-xl"
                                  : index === 1
                                  ? "text-gray-300 text-lg"
                                  : index === 2
                                  ? "text-orange-400 text-lg"
                                  : "text-gray-400"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600">
                              <img
                                src={user.image}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {user.problemSolved.length} problems solved
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-bold text-white">
                              {user.dailyStreak.length}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            day streak
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <AdminUsersPage />

          <ProblemTable problems={problems} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
