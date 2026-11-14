import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import useSheetStore from "../store/useSheetStore";
import { useParams, Link } from "react-router-dom";
import Footer from "../components/Footer";

const DIFFICULTY = {
  EASY: { label: "easy", className: "verdict-ok" },
  MEDIUM: { label: "medium", className: "verdict-warn" },
  HARD: { label: "hard", className: "verdict-err" },
};

function Sheet() {
  const { sheet, getSheet, loading, getProgress, progress } = useSheetStore();
  const { id } = useParams();

  useEffect(() => {
    getSheet(id);
    getProgress(id);
  }, [id]);

  if (loading || !sheet) {
    return (
      <div className="console-root flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin console-phosphor" />
          <p className="code-font console-muted text-sm">
            loading sheet<span className="caret" />
          </p>
        </div>
      </div>
    );
  }

  const problems = sheet.problems || [];
  const problemCount = problems.length || sheet._count?.problems || 0;
  const isFree = sheet.price === 0;
  const completed = progress?.completed ?? 0;
  const total = progress?.total ?? problemCount;
  const progressPercentage = total
    ? Math.round((completed / total) * 100)
    : 0;
  const remaining = Math.max(0, total - completed);
  const firstProblem = problems[0];
  const sheetDifficulty = DIFFICULTY[sheet.difficulty];

  return (
    <div className="console-root min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        {/* breadcrumb */}
        <nav className="code-font mb-6 flex items-center gap-2 text-xs console-muted">
          <Link
            to="/sheets"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--con-phos)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            sheets
          </Link>
          <span>/</span>
          <span className="truncate console-text">{sheet.title}</span>
        </nav>

        {/* hero panel */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="console-panel overflow-hidden rounded-2xl"
        >
          <div className="code-font flex items-center gap-2 border-b console-hairline px-4 py-3 text-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]/70" />
            <span className="console-muted ml-2 hidden truncate sm:inline">
              sheet — {problemCount} {problemCount === 1 ? "problem" : "problems"}
            </span>
            <span className="ml-auto flex items-center gap-3">
              <span className={isFree ? "verdict-ok" : "verdict-warn"}>
                {isFree ? "free access" : `₹${sheet.price}`}
              </span>
              <span className="console-muted hidden items-center gap-1.5 sm:flex">
                <span className="live-dot console-phosphor">●</span> synced
              </span>
            </span>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_320px] lg:gap-10">
            <div>
              <p className="code-font console-muted text-[13px]">
                <span className="console-phosphor">$</span> cat sheet.md
              </p>
              <h1 className="mt-3 text-balance text-3xl font-bold leading-tight tracking-tight console-text sm:text-4xl">
                {sheet.title}
              </h1>
              {sheet.description && (
                <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed console-muted">
                  {sheet.description}
                </p>
              )}

              <div className="code-font mt-6 flex flex-wrap items-center gap-2 text-[12.5px]">
                <span className="console-inset rounded-md px-2.5 py-1 console-muted">
                  {problemCount} problems
                </span>
                <span className="console-inset rounded-md px-2.5 py-1 console-muted">
                  {isFree ? "free" : `₹${sheet.price}`}
                </span>
                {sheetDifficulty && (
                  <span
                    className={`console-inset rounded-md px-2.5 py-1 font-semibold ${sheetDifficulty.className}`}
                  >
                    {sheetDifficulty.label}
                  </span>
                )}
              </div>

              {firstProblem && (
                <Link
                  to={`/problem/${firstProblem.id}`}
                  className="code-font mt-7 inline-flex h-11 items-center gap-2 rounded-lg bg-[#4ade80] px-6 text-sm font-bold text-black transition-colors hover:bg-[#7bef9f]"
                >
                  {completed > 0 ? "continue solving" : "start solving"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            {/* progress inset */}
            <div className="console-inset h-fit rounded-xl p-5">
              <div className="flex items-baseline justify-between">
                <p className="code-font text-[13px] console-muted">progress</p>
                <p className="code-font text-2xl font-semibold tabular-nums console-text">
                  {progressPercentage}
                  <span className="console-phosphor">%</span>
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--con-line)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-[var(--con-phos)]"
                />
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 border-t console-hairline pt-4">
                <div>
                  <dt className="code-font text-[11px] uppercase tracking-wider console-muted">
                    solved
                  </dt>
                  <dd className="code-font mt-1 flex items-center gap-1.5 text-sm font-semibold console-text">
                    <CheckCircle2 className="h-3.5 w-3.5 verdict-ok" />
                    {completed}
                  </dd>
                </div>
                <div>
                  <dt className="code-font text-[11px] uppercase tracking-wider console-muted">
                    remaining
                  </dt>
                  <dd className="code-font mt-1 text-sm font-semibold console-text">
                    {remaining}
                  </dd>
                </div>
              </dl>
              <p className="code-font mt-4 text-[11px] console-muted">
                {completed} of {total} completed
              </p>
            </div>
          </div>
        </motion.section>

        {/* problems */}
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="code-font text-lg font-semibold tracking-tight console-text">
                <span className="console-phosphor">$</span> ls problems/
              </h2>
              <p className="console-muted mt-1 text-[13px]">
                Work top to bottom, or jump straight to a weak topic.
              </p>
            </div>
            <span className="code-font console-inset rounded-md px-2.5 py-1 text-xs console-muted">
              {problemCount} entries
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="console-panel mt-4 overflow-hidden rounded-2xl"
          >
            {problems.length > 0 ? (
              <>
                <div className="code-font hidden grid-cols-[44px_1fr_110px_100px] items-center gap-3 border-b console-hairline px-5 py-2.5 text-[11px] uppercase tracking-wider console-muted sm:grid">
                  <span>#</span>
                  <span>problem</span>
                  <span>difficulty</span>
                  <span />
                </div>

                <div className="console-divide divide-y">
                  {problems.map((problem, i) => {
                    const diff = DIFFICULTY[problem.difficulty] || {
                      label: (problem.difficulty || "unknown").toLowerCase(),
                      className: "console-muted",
                    };
                    return (
                      <motion.div
                        key={problem.id}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                          delay: Math.min(i * 0.03, 0.3),
                          duration: 0.3,
                        }}
                        className="console-hover group grid grid-cols-[36px_1fr_auto] items-center gap-3 px-4 py-4 transition-colors sm:grid-cols-[44px_1fr_110px_100px] sm:px-5"
                      >
                        <span className="code-font text-xs tabular-nums console-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0">
                          <Link
                            to={`/problem/${problem.id}`}
                            className="block truncate text-sm font-semibold console-text transition-colors group-hover:text-[var(--con-phos)]"
                          >
                            {problem.title}
                          </Link>
                          {problem.description && (
                            <p className="mt-1 line-clamp-1 text-[12.5px] leading-relaxed console-muted">
                              {problem.description}
                            </p>
                          )}
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            <span
                              className={`code-font text-[11px] font-semibold sm:hidden ${diff.className}`}
                            >
                              {diff.label}
                            </span>
                            {problem.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="code-font rounded border console-hairline px-1.5 py-0.5 text-[10.5px] console-muted"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <span
                          className={`code-font hidden text-xs font-semibold sm:block ${diff.className}`}
                        >
                          {diff.label}
                        </span>

                        <Link
                          to={`/problem/${problem.id}`}
                          className="code-font inline-flex h-8 items-center gap-1.5 justify-self-end rounded-md border console-hairline px-3 text-[12px] font-semibold console-text transition-colors hover:border-[var(--con-phos)] hover:text-[var(--con-phos)]"
                        >
                          solve <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border console-hairline console-text">
                  <BookOpen className="h-5 w-5" />
                </div>
                <p className="code-font mt-4 text-sm font-semibold console-text">
                  no problems found
                </p>
                <p className="mx-auto mt-1.5 max-w-xs text-[13px] console-muted">
                  This sheet is still being assembled. Check back soon.
                </p>
                <Link
                  to="/sheets"
                  className="code-font console-outline console-hover mt-5 inline-flex h-9 items-center gap-2 rounded-lg px-4 text-[13px] font-semibold console-text"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  back to sheets
                </Link>
              </div>
            )}
          </motion.div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Sheet;
