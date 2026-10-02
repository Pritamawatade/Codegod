import React, { useEffect } from "react";
import useProblemStore from "../store/useProblemStore";
import { Loader2, Flame, Trophy, Target, ArrowRight } from "lucide-react";
import ProblemTable from "../components/ProblemTable";
import { useActionStore } from "../store/useActionStore";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const { isDeletingProblem } = useActionStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems, isDeletingProblem]);

  if (isProblemsLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading problems…</p>
        </div>
      </div>
    );
  }

  const solved = (problems || []).filter((p) =>
    p.solvedBy?.some((u) => u.userId === authUser?.id)
  ).length;
  const total = problems?.length || 0;
  const pct = total ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
        {/* Page header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[13px] font-medium text-zinc-400">
              Welcome back{authUser?.name ? `, ${authUser.name.split(" ")[0]}` : ""} — keep the streak alive.
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-[32px]">Problem set</h1>
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Work through curated problems by difficulty, topic, or company. Every solve moves the needle.
            </p>
          </div>
          <Link
            to="/sheets"
            className="group flex w-fit items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/10 px-4 py-2.5 text-[13px] font-semibold transition-colors hover:bg-zinc-50 dark:hover:bg-white/5"
          >
            Explore sheets <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { icon: Trophy, label: "Solved", value: `${solved}/${total}`, hint: `${pct}% complete` },
            { icon: Target, label: "Remaining", value: `${total - solved}`, hint: "to full completion" },
            { icon: Flame, label: "Streak", value: "Today", hint: "solve to keep it going" },
          ].map((s) => (
            <div key={s.label} className="card-surface flex items-center gap-3 p-3.5 sm:p-4">
              <span className="hidden h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 dark:bg-white/[0.06] sm:flex">
                <s.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{s.label}</p>
                <p className="truncate text-[15px] font-bold tracking-tight sm:text-lg">{s.value}</p>
                <p className="hidden truncate text-xs text-zinc-400 sm:block">{s.hint}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="card-surface mt-3 flex items-center gap-4 p-4">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-zinc-950 dark:bg-white transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="code-font text-xs text-zinc-500">{pct}%</span>
        </div>

        {/* Table */}
        <div className="mt-6">
          <ProblemTable problems={problems} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
