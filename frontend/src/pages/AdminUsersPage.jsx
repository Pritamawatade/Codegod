import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiAward,
  FiActivity,
  FiRefreshCw,
  FiKey,
  FiShield,
  FiExternalLink,
} from "react-icons/fi";
import { use, useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const { allUsers, getAllUsers } = useAuthStore();
 const [users, setUsers] = useState([]);
  useEffect(() => {
    console.log("HI")
    getAllUsers();
    console.log("allUsers", allUsers);
    setUsers(allUsers)
  }, []);

  

  // Process data for charts
  const registrationData = users?.reduce((acc, user) => {
    const date = new Date(user.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object?.entries(registrationData).map(([date, count]) => ({
    date,
    count,
  }));

  const providerData = users?.reduce((acc, user) => {
    acc[user.provider] = (acc[user.provider] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(providerData).map(([name, value]) => ({
    name,
    value,
  }));

  // Filter users based on search and tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "verified") return matchesSearch && user.emailVerified;
    if (activeTab === "unverified") return matchesSearch && !user.emailVerified;
    if (activeTab === "google")
      return matchesSearch && user.provider === "google";

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-[#0b1018]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">User Management</h1>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiUser className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-900"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiUser size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{users.length}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-900"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiMail size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Verified</p>
                <h3 className="text-2xl font-bold">
                  {users.filter((u) => u.emailVerified).length}
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-900"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FiActivity size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Active Today</p>
                <h3 className="text-2xl font-bold">
                  {
                    users.filter((u) =>
                      u.dailyStreak.some(
                        (s) =>
                          new Date(s.date).toDateString() ===
                          new Date().toDateString()
                      )
                    ).length
                  }
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-900"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiAward size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Problems Solved</p>
                <h3 className="text-2xl font-bold">
                  {users?.reduce(
                    (acc, user) => acc + user.problemSolved.length,
                    0
                  )}
                </h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-900"
          >
            <h3 className="text-lg font-semibold mb-4">User Registrations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Registrations" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-md dark:bg-gray-900"
          >
            <h3 className="text-lg font-semibold mb-4">
              Authentication Providers
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-900">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Users
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "verified"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("verified")}
            >
              Verified
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "unverified"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("unverified")}
            >
              Unverified
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "google"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("google")}
            >
              Google Auth
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
               
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                    className="cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.image}
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-50">{user.email}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        {user.provider === "google" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Google
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.dailyStreak.length} days
                          </div>
                          <div className="text-xs text-gray-500">Streak</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.problemSolved.length}
                          </div>
                          <div className="text-xs text-gray-500">Solved</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.emailVerified ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>

                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black dark:text-white dark:bg-[#0b1018] bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <img
                      className="h-16 w-16 rounded-full mr-4"
                      src={selectedUser.image}
                      alt={selectedUser.name}
                    />
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedUser.name}
                      </h2>
                      <p className="text-gray-600">@{selectedUser.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-black dark:text-white">
                        Email
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                        {selectedUser.email}
                        {selectedUser.emailVerified ? (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Verified
                          </span>
                        ) : (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Unverified
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Authentication
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedUser.provider === "google" ? (
                          <span className="inline-flex items-center text-black dark:text-white">
                            <img
                              src="https://img.icons8.com/?size=100&id=17904&format=png&color=ffffff"
                              alt="Google"
                              className="h-4 w-4 mr-2"
                            />
                            Google OAuth
                          </span>
                        ) : (
                          "Email/Password"
                        )}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Account Created
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Activity Stats
                      </h3>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {selectedUser.dailyStreak.length}
                          </p>
                          <p className="text-xs text-gray-500">Day Streak</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {selectedUser.problemSolved.length}
                          </p>
                          <p className="text-xs text-gray-500">
                            Problems Solved
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {selectedUser.dailyStreak.some(
                              (s) =>
                                new Date(s.date).toDateString() ===
                                new Date().toDateString()
                            )
                              ? "Active"
                              : "Inactive"}
                          </p>
                          <p className="text-xs text-gray-500">Today</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Recent Activity
                      </h3>
                      <div className="mt-2 space-y-2">
                        {selectedUser.problemSolved
                          .slice(0, 3)
                          .map((problem, idx) => (
                            <div
                              key={idx}
                              className="flex items-center text-sm"
                            >
                              <FiActivity className="text-green-500 mr-2" />
                              <span>
                                Solved problem #{problem.problemId.slice(0, 8)}
                              </span>
                              <span className="text-gray-400 text-xs ml-auto">
                                {new Date(
                                  problem.createdAt
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminUsersPage;
