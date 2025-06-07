import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  Users,
  Clock,
  Star,
  Trophy,
  CheckCircle,
} from "lucide-react";
import useSheetStore from "../store/useSheetStore";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import RazorpayButton from "../RazorpayButton";
import { useAuthStore } from "../store/useAuthStore";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: "spring", stiffness: 120, damping: 12 },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function Sheets() {
  const { sheets, getAllSheets, getSheet, sheet } = useSheetStore();
  const [isPaymentLoading, setIsPaymentLoading] = useState(null);
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    getAllSheets();
  }, []);

  const handleSheetClick = async (sheetId, i) => {
    try {
      setIsPaymentLoading(sheetId);
      const res = await getSheet(sheetId);

      if (res === "Access denied") {
        try {
          const res = await axiosInstance.post(`/payments/create-order`, {
            amount: sheets[i].price,
            currency: "INR",
            receipt: `receipt_${sheetId}`,
          });

          console.log("res = ", res);
          const order = res.data.data;

          console.log("order", order);

          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "CodeGod",
            description: `Purchase ${sheets[i].title}`,
            order_id: order.id,
            handler: async function (response) {
              console.log("Payment successful", response);

              // Optional: store transaction in DB via another API
              await axiosInstance.post("/payments/save-payment", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                sheetId,
                userId: authUser.id, // get from auth context
              });
            },
            prefill: {
              name: authUser.name,
              email: authUser.email,
            },
            theme: {
              color: "#000000",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (err) {
          console.error("Payment error", err);
        }
      } else {
        navigate(`/sheets/${sheetId}`);
      }
    } catch (error) {
      if (res.staus === 403) {
        console.log("403");
      }
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty?.includes("Beginner"))
      return "text-emerald-600 dark:text-emerald-400";
    if (difficulty?.includes("Intermediate"))
      return "text-amber-600 dark:text-amber-400";
    if (difficulty?.includes("Advanced") || difficulty?.includes("Expert"))
      return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Curated Learning Paths
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            DSA <span className="text-blue-600 dark:text-blue-400">Sheets</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Premium curated problem sheets designed by experts to accelerate
            your data structures and algorithms mastery journey.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {sheets.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Expert Sheets
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {sheets.reduce(
                (total, sheet) => total + sheet._count.problems,
                0
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Problems
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              10K+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Students
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              4.9
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Rating
            </div>
          </div>
        </motion.div>

        {/* Sheets Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {sheets.map((sheet, i) => (
            <motion.div
              key={sheet.id}
              custom={i}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                      sheet.price === 0
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                    }`}
                  >
                    {sheet.price === 0 ? "Free" : `₹${sheet.price}`}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {sheet.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {sheet.description}
                </p>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {sheet._count.problems}
                      </span>{" "}
                      Problems
                    </span>
                  </div>

                  {sheet.difficulty && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <span
                        className={`text-sm font-medium ${getDifficultyColor(
                          sheet.difficulty
                        )}`}
                      >
                        {sheet.difficulty}
                      </span>
                    </div>
                  )}

                  {sheet.estimatedTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {sheet.estimatedTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleSheetClick(sheet.id, i)}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 group/btn"
                >
                  {isPaymentLoading && isPaymentLoading === sheet.id ? (
                    <span>Loading...</span>
                  ) : (
                    <span>Start learning</span>
                  )}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
