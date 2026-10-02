import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Split from "react-split";
import {
  Minimize2,
  Maximize2,
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  ThumbsUp,
  ThumbsDown,
  Check,
  ChevronDown,
  RotateCcw,
  Pause,
  Loader2,
  Copy,
  ListChecks,
} from "lucide-react";

import useProblemStore from "../store/useProblemStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { getLanguageId } from "../lib/lang";
import SubmissionResults from "../components/Submission";
import { useAuthStore } from "../store/useAuthStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import toast from "react-hot-toast";
import useThemeStore from "../store/useThemeStore";
import DiscussionList from "../components/DiscussionList";
import SubmissionResultCard from "../components/SubmissionResultCard";

const DIFF_DOT = {
  Easy: "bg-emerald-500",
  Medium: "bg-amber-500",
  Hard: "bg-rose-500",
};
const DIFF_TEXT = {
  Easy: "text-emerald-600 dark:text-emerald-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Hard: "text-rose-600 dark:text-rose-400",
};

const TABS = [
  { id: "description", label: "Description", icon: FileText },
  { id: "submissions", label: "Submissions", icon: Code2 },
  { id: "discussion", label: "Discussion", icon: MessageSquare },
  { id: "hints", label: "Hints", icon: Lightbulb },
];

const ProblemPage = () => {
  const { id } = useParams();
  const {
    getProblemById,
    problem,
    isProblemLoading,
    getLikesAndDislikes,
    postLikeAndDislike,
    liked,
    likes,
    dislikes,
  } = useProblemStore();
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("C");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wrapperRef = useRef(null);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const { getSubmissionCountForProblem } = useSubmissionStore();
  const { theme } = useThemeStore();
  const { authUser } = useAuthStore();
  const { executeCode, submission, isExecuting, isSubmitting, submitResult, submitCode } =
    useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
    getLikesAndDislikes(id);
  }, [id]);

  useEffect(() => {
    const exitOnEsc = (e) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    document.addEventListener("keydown", exitOnEsc);
    return () => document.removeEventListener("keydown", exitOnEsc);
  }, [isFullscreen]);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");
      setTestCases(
        problem.testCases?.map((tc) => ({ input: tc.input, output: tc.output })) || []
      );
    }
  }, [problem, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const submitFeedback = (likeValue) => {
    postLikeAndDislike(id, { liked: likeValue, userId: authUser?.id });
    getLikesAndDislikes(id);
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num) => num.toString().padStart(2, "0");
    if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  useEffect(() => {
    let intervalId;
    if (isTimerRunning) {
      intervalId = setInterval(() => setElapsedTime(Date.now() - startTime), 1000);
    }
    return () => clearInterval(intervalId);
  }, [isTimerRunning, startTime]);

  const handleRunCode = (e) => {
    e?.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  const handleSubmitCode = (e) => {
    e?.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);
      submitCode(code, language_id, stdin, expected_outputs, id);
      setActiveTab("submissions");
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "'") {
        e.preventDefault();
        handleRunCode();
      }
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleSubmitCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const copyBlock = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="text-sm">
            <p className="text-[14px] leading-[1.75] text-zinc-600 dark:text-zinc-300">{problem.description}</p>

            {problem.examples && (
              <div className="mt-8">
                <h3 className="text-[13px] font-semibold uppercase tracking-wider text-zinc-400">Examples</h3>
                <div className="mt-3 space-y-3">
                  {Object.entries(problem.examples).map(([lang, example], idx) => (
                    <div key={lang} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10">
                      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-white/[0.03] px-4 py-2">
                        <span className="text-xs font-semibold">Example {idx + 1}</span>
                        <button
                          onClick={() => copyBlock(`Input: ${example.input}\nOutput: ${example.output}`)}
                          className="flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                      </div>
                      <div className="space-y-3 p-4">
                        <div>
                          <p className="mb-1.5 text-xs font-medium text-zinc-400">Input</p>
                          <pre className="code-font overflow-x-auto rounded-lg bg-zinc-50 dark:bg-white/[0.04] p-3 text-[13px] text-zinc-800 dark:text-zinc-200">{example.input}</pre>
                        </div>
                        <div>
                          <p className="mb-1.5 text-xs font-medium text-zinc-400">Output</p>
                          <pre className="code-font overflow-x-auto rounded-lg bg-zinc-50 dark:bg-white/[0.04] p-3 text-[13px] text-zinc-800 dark:text-zinc-200">{example.output}</pre>
                        </div>
                        {example.explanation && (
                          <p className="text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Explanation: </span>
                            {example.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {problem.constraints && (
              <div className="mt-8">
                <h3 className="text-[13px] font-semibold uppercase tracking-wider text-zinc-400">Constraints</h3>
                <pre className="code-font mt-3 overflow-x-auto rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.03] p-4 text-[13px] leading-relaxed whitespace-pre-wrap">{problem.constraints}</pre>
              </div>
            )}
          </div>
        );

      case "submissions":
        return isSubmitting ? (
          <div className="flex items-center gap-2 py-10 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Evaluating your solution…
          </div>
        ) : submitResult ? (
          <SubmissionResultCard submission={submitResult} />
        ) : (
          <div className="flex flex-col items-center py-12 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/[0.06]">
              <ListChecks className="h-5 w-5 text-zinc-400" />
            </span>
            <p className="mt-3 text-sm font-semibold">No submissions yet</p>
            <p className="mt-1 max-w-[240px] text-[13px] text-zinc-500">Submit your solution to see detailed results here.</p>
          </div>
        );

      case "discussion":
        return <DiscussionList problemId={id} />;

      case "hints":
        return problem?.hints ? (
          <div className="rounded-xl border border-amber-200/70 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-500/[0.06] p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold">Hint</h3>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{problem.hints}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-12 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/[0.06]">
              <Lightbulb className="h-5 w-5 text-zinc-400" />
            </span>
            <p className="mt-3 text-sm font-semibold">No hints for this one</p>
            <p className="mt-1 text-[13px] text-zinc-500">Try working through it from first principles.</p>
          </div>
        );

      default:
        return null;
    }
  };

  if (isProblemLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#09090b]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          <p className="text-sm text-zinc-500">Loading problem…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-50 dark:bg-[#09090b] text-zinc-950 dark:text-zinc-100">
      {/* Top bar */}
      <header className="z-40 flex h-13 min-h-[52px] items-center gap-3 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e] px-3 sm:px-4">
        <Link to="/problems" className="flex items-center gap-1 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
          Problems <ChevronRight className="h-3.5 w-3.5" />
        </Link>
        <h1 className="truncate text-sm font-semibold tracking-tight">{problem?.title}</h1>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 dark:border-white/10 px-2.5 py-1 text-[11px] font-semibold">
          <span className={`h-1.5 w-1.5 rounded-full ${DIFF_DOT[problem?.difficulty] || "bg-zinc-400"}`} />
          <span className={DIFF_TEXT[problem?.difficulty]}>{problem?.difficulty}</span>
        </span>

        <div className="ml-1 hidden items-center gap-0.5 sm:flex">
          <button onClick={() => submitFeedback(true)} className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5">
            <ThumbsUp className="h-3.5 w-3.5" fill={liked ? "#10b981" : "none"} stroke={liked ? "#10b981" : "currentColor"} /> {likes || 0}
          </button>
          <button onClick={() => submitFeedback(false)} className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5">
            <ThumbsDown className="h-3.5 w-3.5" fill={liked === false ? "#f43f5e" : "none"} stroke={liked === false ? "#f43f5e" : "currentColor"} /> {dislikes || 0}
          </button>
        </div>

        {/* Timer */}
        <div className="ml-auto flex items-center gap-1">
          {!isTimerRunning && elapsedTime === 0 ? (
            <button
              onClick={() => { setIsTimerRunning(true); setStartTime(Date.now() - elapsedTime); }}
              className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5"
              title="Start timer"
            >
              <Clock className="h-4 w-4" /> <span className="code-font hidden md:inline">00:00</span>
            </button>
          ) : (
            <div className="flex items-center gap-0.5 rounded-lg border border-zinc-200 dark:border-white/10 px-1.5 py-1">
              <span className="code-font px-1 text-[13px] font-medium tabular-nums">{formatTime(elapsedTime)}</span>
              <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-white/10" title={isTimerRunning ? "Pause" : "Resume"}>
                {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => { setIsTimerRunning(false); setElapsedTime(0); }} className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-white/10" title="Reset">
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="code-font h-8 appearance-none rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.04] pl-3 pr-8 text-xs font-medium outline-none"
          >
            {Object.keys(problem?.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        </div>

        <div className="hidden items-center gap-0.5 md:flex">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            aria-label="Bookmark"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 ${isBookmarked ? "text-amber-500" : "text-zinc-400"}`}
          >
            <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <button
            aria-label="Share"
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-700"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={handleRunCode}
          disabled={isExecuting}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/10 px-3 text-[13px] font-semibold transition-colors hover:bg-zinc-100 dark:hover:bg-white/5 disabled:opacity-50"
        >
          {isExecuting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">Run</span>
        </button>
        <button
          onClick={handleSubmitCode}
          disabled={isSubmitting}
          className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Submit
        </button>
      </header>

      {/* Workspace */}
      {problem && (
        <div className="min-h-0 flex-1 p-2">
          <Split className="split h-full gap-0" minSize={280} gutterSize={6} snapOffset={0} dragInterval={1}>
            {/* Left: problem */}
            <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e]">
              <div className="flex shrink-0 items-center gap-0.5 overflow-x-auto border-b border-zinc-200 dark:border-white/10 px-2 py-1.5">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      activeTab === t.id
                        ? "bg-zinc-100 dark:bg-white/10 text-zinc-950 dark:text-white"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <t.icon className="h-3.5 w-3.5" /> {t.label}
                  </button>
                ))}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-5">{renderTabContent()}</div>
            </div>

            {/* Right: editor + console */}
            <div className="flex min-h-0 flex-col">
              <Split className="split1 flex h-full min-h-0 flex-col" minSize={140} gutterSize={6} direction="vertical">
                <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#1e1e1e]">
                  <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 dark:border-white/10 px-4 py-2">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <Terminal className="h-3.5 w-3.5" /> {selectedLanguage} <span className="text-zinc-400 dark:text-zinc-600">·</span> <span className="code-font">solution.{selectedLanguage === "Python" ? "py" : selectedLanguage === "Java" ? "java" : "txt"}</span>
                    </span>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="rounded-md p-1.5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white"
                    >
                      {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  </div>
                  <div ref={wrapperRef} className={isFullscreen ? "fixed inset-0 z-[100] bg-white dark:bg-[#1e1e1e]" : "min-h-0 flex-1"}>
                    <Editor
                      height="100%"
                      language={selectedLanguage.toLowerCase()}
                      theme={theme === "dark" ? "vs-dark" : "light"}
                      value={code}
                      onChange={(v) => setCode(v || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13.5,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontLigatures: true,
                        padding: { top: 12 },
                        renderLineHighlight: "all",
                        smoothScrolling: true,
                      }}
                    />
                  </div>
                </div>

                <div className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e]">
                  <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 dark:border-white/10 px-4 py-2.5">
                    <h3 className="text-[13px] font-semibold">{submission ? "Run results" : "Test cases"}</h3>
                    <span className="code-font text-[11px] text-zinc-400">{testCases.length} cases</span>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto p-4">
                    {submission ? (
                      <SubmissionResults submission={submission} />
                    ) : testCases.length > 0 ? (
                      <>
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                          {testCases.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveTestCase(i)}
                              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                activeTestCase === i
                                  ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950"
                                  : "bg-zinc-100 dark:bg-white/[0.06] text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                              }`}
                            >
                              Case {i + 1}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="mb-1.5 text-xs font-medium text-zinc-400">Input</p>
                            <pre className="code-font overflow-x-auto rounded-lg bg-zinc-50 dark:bg-white/[0.04] p-3 text-[12.5px]">{testCases[activeTestCase]?.input}</pre>
                          </div>
                          <div>
                            <p className="mb-1.5 text-xs font-medium text-zinc-400">Expected output</p>
                            <pre className="code-font overflow-x-auto rounded-lg bg-zinc-50 dark:bg-white/[0.04] p-3 text-[12.5px]">{testCases[activeTestCase]?.output}</pre>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="py-6 text-center text-[13px] text-zinc-500">No test cases available.</p>
                    )}
                  </div>
                </div>
              </Split>
            </div>
          </Split>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
