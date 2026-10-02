import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

/* ---------- count-up numeral (starts when scrolled into view) ---------- */
function useCountUp(target, start, duration = 1500) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reduce) {
      setValue(target);
      return;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setValue(Math.round(target * (1 - Math.pow(2, -10 * p))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration, reduce]);
  return value;
}

function Stat({ value, suffix, label, sub, started, format }) {
  const n = useCountUp(value, started);
  const text = format ? format(n) : n.toLocaleString("en-US");
  return (
    <div className="border-l console-hairline pl-5">
      <p className="code-font text-4xl font-semibold tabular-nums tracking-tight text-zinc-50 sm:text-5xl">
        {text}
        <span className="console-phosphor">{suffix}</span>
      </p>
      <p className="mt-2 text-sm font-medium text-zinc-200">{label}</p>
      <p className="console-muted mt-0.5 text-[13px]">{sub}</p>
    </div>
  );
}

/* ---------- live verdict feed ---------- */
const FEED_POOL = [
  { file: "two-sum.py", verdict: "accepted", detail: "48ms · 16.4mb" },
  { file: "median-sort.cpp", verdict: "accepted", detail: "112ms · 11.2mb" },
  { file: "lru-cache.java", verdict: "wrong answer", detail: "case 14/63" },
  { file: "word-ladder.js", verdict: "accepted", detail: "96ms · 22.1mb" },
  { file: "trap-rain.go", verdict: "time limit", detail: "case 41/58 · >2s" },
  { file: "n-queens.py", verdict: "accepted", detail: "61ms · 15.0mb" },
  { file: "merge-k-lists.c", verdict: "accepted", detail: "22ms · 9.8mb" },
  { file: "coin-change.py", verdict: "wrong answer", detail: "case 7/22" },
  { file: "detect-cycle.cpp", verdict: "accepted", detail: "74ms · 13.5mb" },
];

const VERDICT_COLOR = {
  accepted: "text-[#4ade80]",
  "wrong answer": "text-[#f87171]",
  "time limit": "text-[#fbbf24]",
};

function JudgeFeed() {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState(() =>
    FEED_POOL.slice(0, reduce ? 7 : 3).map((l, i) => ({ ...l, key: i }))
  );
  const idx = useRef(3);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      setLines((prev) => {
        const next = { ...FEED_POOL[idx.current % FEED_POOL.length], key: Date.now() };
        idx.current += 1;
        return [...prev.slice(-6), next];
      });
    }, 1600);
    return () => clearInterval(t);
  }, [reduce]);

  return (
    <div className="code-font text-[12.5px] leading-[2]">
      {lines.map((l) => (
        <p key={l.key} className="feed-line flex flex-wrap gap-x-3 whitespace-pre-wrap">
          <span className="console-muted tabular-nums">
            {new Date(l.key).toTimeString().slice(0, 8)}
          </span>
          <span className="text-zinc-200">{l.file}</span>
          <span className={`font-semibold ${VERDICT_COLOR[l.verdict]}`}>{l.verdict}</span>
          <span className="console-muted">{l.detail}</span>
        </p>
      ))}
      <p className="console-muted">
        <span className="live-dot console-phosphor">●</span> listening for submissions
        <span className="caret" />
      </p>
    </div>
  );
}

/* ---------- typed hero line (single load-time sequence) ---------- */
function TypedHeadline() {
  const reduce = useReducedMotion();
  const full = "Solve. Submit. Get judged.";
  const [chars, setChars] = useState(reduce ? full.length : 0);
  useEffect(() => {
    if (reduce) return;
    if (chars >= full.length) return;
    const t = setTimeout(() => setChars((c) => c + 1), 55);
    return () => clearTimeout(t);
  }, [chars, reduce]);
  const done = chars >= full.length;
  return (
    <h1 className="code-font text-balance text-4xl font-bold leading-[1.08] tracking-tight text-zinc-50 sm:text-6xl">
      {full.slice(0, chars)}
      {!done && <span className="caret" aria-hidden />}
    </h1>
  );
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums">{now.toTimeString().slice(0, 8)}</span>;
}

/* ---------- scroll-driven submission pipeline ---------- */
function Pipeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const fill = useTransform(smooth, [0, 1], ["0%", "100%"]);
  const packetA = useTransform(smooth, [0, 1], ["2%", "98%"]);
  const packetB = useTransform(smooth, [0, 1], ["-6%", "90%"]);

  const stages = [
    {
      node: "stdin",
      title: "Your code arrives",
      body: "Picked from 13 runtimes, fenced off so a bad loop can't take down the box.",
      at: 0.05,
    },
    {
      node: "judge",
      title: "Hidden cases run",
      body: "Every submission faces the full case set, not just the samples you can see.",
      at: 0.5,
    },
    {
      node: "verdict",
      title: "A verdict lands",
      body: "Accepted, wrong answer, or time limit — with runtime and memory attached.",
      at: 0.95,
    },
  ];

  return (
    <div ref={ref}>
      {/* track */}
      <div className="relative mb-10 h-px bg-white/10" aria-hidden>
        <motion.div className="absolute inset-y-0 left-0 bg-[#4ade80]" style={{ width: fill }} />
        <motion.span
          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4ade80] shadow-[0_0_12px_#4ade80]"
          style={{ left: packetA }}
        />
        <motion.span
          className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4ade80]/50"
          style={{ left: packetB }}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {stages.map((s) => (
          <Stage key={s.node} stage={s} progress={smooth} />
        ))}
      </div>
    </div>
  );
}

function Stage({ stage, progress }) {
  const lo = Math.max(0, stage.at - 0.18);
  const opacity = useTransform(progress, [lo, stage.at], [0.35, 1]);
  const border = useTransform(progress, [lo, stage.at], ["#ffffff17", "#4ade8066"]);
  return (
    <motion.div
      className="console-panel rounded-xl p-6"
      style={{ opacity, borderColor: border, borderWidth: 1, borderStyle: "solid" }}
    >
      <p className="code-font console-phosphor text-[13px]">{stage.node}</p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-50">{stage.title}</h3>
      <p className="console-muted mt-1.5 max-w-[46ch] text-sm leading-relaxed">{stage.body}</p>
    </motion.div>
  );
}

/* ---------- page ---------- */
const CodeGodLanding = () => {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const [copied, setCopied] = useState(false);

  const copySignup = () => {
    navigator.clipboard.writeText("npx codegod signup --free");
    setCopied(true);
    toast.success("Command copied — paste it anywhere");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="console-root">
      {/* hero: the machine room */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="scanline absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-[#4ade80]/[0.04] to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6 sm:pt-16">
          <div className="console-panel overflow-hidden rounded-2xl">
            {/* status bar */}
            <div className="code-font flex items-center gap-2 border-b border-white/10 px-4 py-3 text-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]/70" />
              <span className="console-muted ml-2 hidden sm:inline">codegod — judge v2.4</span>
              <span className="ml-auto flex items-center gap-3">
                <span className="console-muted hidden items-center gap-1.5 sm:flex">
                  <span className="live-dot console-phosphor">●</span> online
                </span>
                <span className="console-muted tabular-nums">
                  <Clock />
                </span>
              </span>
            </div>

            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="code-font console-muted text-[13px]">
                  <span className="console-phosphor">$</span> whoami — guest
                </p>
                <div className="mt-4">
                  <TypedHeadline />
                </div>
                <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-zinc-400">
                  CodeGod is a practice ground for data structures and algorithms with a
                  real online judge. Write code, submit, and find out exactly where you
                  stand — then close the gap.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => navigate("/problems")}
                    className="code-font h-11 rounded-lg bg-[#4ade80] px-6 text-sm font-bold text-black transition-colors hover:bg-[#7bef9f]"
                                     >
                    start solving
                  </button>
                  <button
                    onClick={() => navigate("/sheets")}
                    className="code-font h-11 rounded-lg border border-white/15 px-6 text-sm font-semibold text-zinc-100 transition-colors hover:border-white/35 hover:bg-white/5"
                  >
                    browse the problem set
                  </button>
                </div>
                <p className="code-font console-muted mt-6 text-xs">
                  free to start · 13 runtimes · no setup
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                <JudgeFeed />
              </div>
            </div>
          </div>
          <p className="code-font console-muted mt-6 text-center text-xs">
            scroll to inspect the machine
          </p>
        </div>
      </section>

      {/* animated numbers */}
      <section className="border-t border-white/10">
        <div ref={statsRef} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="code-font text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
            Judge performance
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            <Stat value={50} suffix="+" label="Problems in the bank" sub="curated, company-tagged" started={statsInView} />
            <Stat value={13} suffix="" label="Language runtimes" sub="python to c to go" started={statsInView} />
            <Stat value={12408} suffix="" label="Verdicts served" sub="and counting" started={statsInView} />
            <Stat value={84} suffix="ms" label="Median judge time" sub="submit to verdict" started={statsInView} />
          </div>
        </div>
      </section>

      {/* pipeline draws with scroll */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="code-font text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
            How a submission travels
          </h2>
          <p className="console-muted mt-3 max-w-[60ch] text-[15px] leading-relaxed">
            Keep scrolling. The packet follows your scroll position from your editor to
            the verdict.
          </p>
          <div className="mt-12">
            <Pipeline />
          </div>
        </div>
      </section>

      {/* the loop, as shell history */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="code-font text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
            The practice loop
          </h2>
          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {[
              {
                cmd: "$ pick",
                title: "Choose your battleground",
                body: "Filter by difficulty, topic, or the companies asking the question. Follow a sheet instead of grinding at random.",
                cta: "See sheets",
                to: "/sheets",
              },
              {
                cmd: "$ solve",
                title: "Work in a real editor",
                body: "A full IDE with 13 runtimes, instant runs, and per-case feedback when something breaks.",
                cta: "Open problems",
                to: "/problems",
              },
              {
                cmd: "$ repeat",
                title: "Build the streak",
                body: "Daily activity, submission history, and discussions keep you coming back until hard feels routine.",
                cta: "View your profile",
                to: "/profile",
              },
            ].map((row) => (
              <div
                key={row.cmd}
                className="group grid gap-2 py-7 transition-colors hover:bg-white/[0.02] sm:grid-cols-[120px_1fr_auto] sm:items-center sm:gap-6 sm:px-4"
              >
                <p className="code-font console-phosphor text-sm font-semibold">{row.cmd}</p>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-zinc-50">{row.title}</h3>
                  <p className="console-muted mt-1 max-w-[62ch] text-sm leading-relaxed">{row.body}</p>
                </div>
                <button
                  onClick={() => navigate(row.to)}
                  className="code-font w-fit rounded-lg border border-white/15 px-4 py-2 text-[13px] font-semibold text-zinc-100 transition-colors group-hover:border-[#4ade80]/50 group-hover:text-[#4ade80]"
                >
                  {row.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* signup command */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="console-panel rounded-2xl p-6 sm:p-10">
            <h2 className="code-font text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
              Ship your first solution tonight
            </h2>
            <p className="console-muted mt-3 max-w-[58ch] text-[15px] leading-relaxed">
              One account, the full judge, and your streak starts counting from day one.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={copySignup}
                className="code-font flex h-12 flex-1 items-center gap-3 rounded-lg border border-white/15 bg-black/50 px-4 text-left text-sm text-zinc-200 transition-colors hover:border-[#4ade80]/50"
              >
                <span className="console-phosphor">$</span>
                <span className="flex-1 truncate">npx codegod signup --free</span>
                {copied ? (
                  <Check className="h-4 w-4 shrink-0 text-[#4ade80]" />
                ) : (
                  <Copy className="h-4 w-4 shrink-0 text-zinc-500" />
                )}
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="code-font h-12 rounded-lg bg-[#4ade80] px-7 text-sm font-bold text-black transition-colors hover:bg-[#7bef9f]"
              >
                create account
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="dark">
        <Footer />
      </div>
    </div>
  );
};

export default CodeGodLanding;
