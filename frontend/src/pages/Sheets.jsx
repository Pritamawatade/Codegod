import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  Clock,
  Trophy,
  CheckCircle,
} from "lucide-react";
import useSheetStore from "../store/useSheetStore";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const getDifficultyColor = (difficulty) => {
  if (difficulty?.includes("Beginner")) return "verdict-ok";
  if (difficulty?.includes("Intermediate")) return "verdict-warn";
  if (difficulty?.includes("Advanced") || difficulty?.includes("Expert"))
    return "verdict-err";
  return "console-muted";
};

function Stat({ value, label, sub }) {
  return (
    <div className="border-l console-hairline pl-5">
      <p className="code-font text-4xl font-semibold tabular-nums tracking-tight console-text sm:text-5xl">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium console-text">{label}</p>
      <p className="console-muted mt-0.5 text-[13px]">{sub}</p>
    </div>
  );
}

export default function Sheets() {
  const { sheets, getAllSheets, getSheet } = useSheetStore();
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

          const order = res.data.data;

          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "CodeGod",
            description: `Purchase ${sheets[i].title}`,
            order_id: order.id,
            handler: async function (response) {
              await axiosInstance.post("/payments/save-payment", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                sheetId,
                userId: authUser.id,
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
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const totalProblems = sheets.reduce(
    (total, sheet) => total + (sheet._count?.problems || 0),
    0
  );
  const freeSheets = sheets.filter((sheet) => sheet.price === 0).length;
  const premiumSheets = sheets.length - freeSheets;

  return (
    <div className="console-root min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        {/* hero */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="console-panel overflow-hidden rounded-2xl"
        >
          <div className="code-font flex items-center gap-2 border-b console-hairline px-4 py-3 text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]/70" />
            <span className="console-muted ml-2 hidden sm:inline">
              codegod — sheet index
            </span>
            <span className="ml-auto flex items-center gap-1.5 console-muted">
              <span className="live-dot console-phosphor">●</span> live
            </span>
          </div>

          <div className="p-6 sm:p-10">
            <p className="code-font console-muted text-[13px]">
              <span className="console-phosphor">$</span> ls sheets/ —curated
            </p>
            <h1 className="code-font mt-3 text-balance text-3xl font-bold leading-tight tracking-tight console-text sm:text-5xl">
              Problem sheets
            </h1>
            <p className="mt-4 max-w-[62ch] text-[15px] leading-relaxed console-muted">
              Structured sets of problems that build from fundamentals to
              interview-hard. Pick a path, work top to bottom, and let the
              judge keep score.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/problems")}
                className="code-font h-11 rounded-lg bg-[#4ade80] px-6 text-sm font-bold text-black transition-colors hover:bg-[#7bef9f]"
              >
                browse all problems
              </button>
              <Link
                to="/profile"
                className="code-font console-outline console-hover inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold console-text transition-colors"
              >
                view your progress
              </Link>
            </div>
          </div>
        </motion.header>

        {/* stats */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t console-hairline pt-10 lg:grid-cols-4"
        >
          <Stat value={sheets.length} label="Sheets" sub="curated paths" />
          <Stat value={totalProblems} label="Problems" sub="across all sheets" />
          <Stat value={freeSheets} label="Free" sub="no purchase needed" />
          <Stat value={premiumSheets} label="Premium" sub="one-time unlock" />
        </motion.section>

        {/* sheet grid */}
        <section className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="code-font text-lg font-semibold tracking-tight console-text">
                <span className="console-phosphor">$</span> ls sheets/
              </h2>
              <p className="console-muted mt-1 text-[13px]">
                Pick a path and pick up where you left off.
              </p>
            </div>
            <span className="code-font console-inset rounded-md px-2.5 py-1 text-xs console-muted">
              {sheets.length} entries
            </span>
          </div>

          {sheets.length === 0 ? (
            <div className="console-panel mt-4 rounded-2xl px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border console-hairline console-text">
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="code-font mt-4 text-sm font-semibold console-text">
                no sheets found
              </p>
              <p className="mx-auto mt-1.5 max-w-xs text-[13px] console-muted">
                Sheets are being prepared. Try the full problem set meanwhile.
              </p>
              <button
                onClick={() => navigate("/problems")}
                className="code-font console-outline console-hover mt-5 inline-flex h-9 items-center gap-2 rounded-lg px-4 text-[13px] font-semibold console-text"
              >
                open problems
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {sheets.map((sheet, i) => {
                const isFree = sheet.price === 0;
                const isLoading = isPaymentLoading === sheet.id;
                return (
                  <motion.article
                    key={sheet.id}
                    custom={i}
                    variants={cardVariants}
                    className="console-panel group flex flex-col overflow-hidden rounded-2xl transition-colors hover:border-[var(--con-phos)]"
                  >
                    <div className="flex items-center justify-between border-b console-hairline px-5 py-2.5">
                      <span className="code-font text-[11px] uppercase tracking-wider console-muted">
                        sheet_{String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`code-font text-[12px] font-semibold ${
                          isFree ? "verdict-ok" : "verdict-warn"
                        }`}
                      >
                        {isFree ? "free" : `₹${sheet.price}`}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-semibold tracking-tight console-text">
                        {sheet.title}
                      </h3>
                      <p className="console-muted mt-2 line-clamp-3 flex-1 text-[13px] leading-relaxed">
                        {sheet.description}
                      </p>

                      <div className="code-font mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t console-hairline pt-4 text-[12px] console-muted">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>{sheet._count?.problems || 0} problems</span>
                        </div>
                        {sheet.difficulty && (
                          <div className="flex items-center gap-1.5">
                            <Trophy className="h-3.5 w-3.5" />
                            <span className={getDifficultyColor(sheet.difficulty)}>
                              {sheet.difficulty}
                            </span>
                          </div>
                        )}
                        {sheet.estimatedTime && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{sheet.estimatedTime}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleSheetClick(sheet.id, i)}
                        disabled={isLoading}
                        className="code-font mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border console-hairline px-4 text-[13px] font-semibold console-text transition-colors hover:border-[var(--con-phos)] hover:text-[var(--con-phos)] disabled:opacity-60"
                      >
                        {isLoading ? "loading…" : "start learning"}
                        {!isLoading && (
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        )}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
