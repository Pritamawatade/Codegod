import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import useProblemStore from "../store/useProblemStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { getLanguageId } from "../lib/lang";
import SubmissionResults from "../components/Submission";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

  const { authUser } = useAuthStore();
  const { executeCode, submission, isExecuting } = useExecutionStore();

  const submissionCount = 10;
  if (!authUser) {
    Navigate("/login");
  }
  useEffect(() => {
    console.log("problem id", id);
    getProblemById(id);
  }, [id]);
  useEffect(() => {
    console.log("problem id", id);
    getProblemById(id);
  }, []);

  useEffect(() => {
    // ⛔ Right-click
    const handleContextMenu = (e) => e.preventDefault();

    // ⛔ Dragging
    const handleDragStart = (e) => e.preventDefault();

    // ⛔ Text selection
    const handleSelectStart = (e) => e.preventDefault();

    // ⛔ Keyboard shortcuts
    const handleKeyDown = (e) => {
      const forbiddenKeys = ["u", "c", "s", "v", "p"];
      const key = e.key.toLowerCase();

      if (e.ctrlKey && forbiddenKeys.includes(key)) {
        e.preventDefault();
        toast.error(`"${e.key}" shortcut is disabled`);
      }

      // ⛔ F12 Developer Tools
      if (key === "f12") {
        e.preventDefault();
        toast.error("Dev tools are disabled");
      }

      // ⛔ Print (Ctrl + P)
      if (e.ctrlKey && key === "p") {
        e.preventDefault();
        toast.error("Printing is disabled");
      }
    };

    // Attach all listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("keydown", handleKeyDown);

    // Detach listeners on unmount to prevent memory leaks
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!problem) {
    console.log("Problem === ", problem);
  } else {
    console.log("Problem === ", problem);
  }

  useEffect(() => {
    if (problem) {
      console.log("problem = ", problem);
      setCode(problem.codeSnippets?.[selectedLanguage] || "");

      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    } else {
      console.log("problem = ", problem);
    }
  }, [problem, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-base md:text-lg mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-slate-100 dark:bg-slate-800 p-4 md:p-6 rounded-lg mb-6 font-mono shadow-sm"
                    >
                      <div className="mb-4">
                        <div className="text-blue-600 dark:text-blue-400 mb-2 text-sm font-semibold">
                          Input:
                        </div>
                        <div className="bg-slate-200 dark:bg-slate-900 px-4 py-2 rounded-md overflow-x-auto">
                          <code className="text-slate-900 dark:text-slate-100">
                            {example.input}
                          </code>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-blue-600 dark:text-blue-400 mb-2 text-sm font-semibold">
                          Output:
                        </div>
                        <div className="bg-slate-200 dark:bg-slate-900 px-4 py-2 rounded-md overflow-x-auto">
                          <code className="text-slate-900 dark:text-slate-100">
                            {example.output}
                          </code>
                        </div>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-emerald-600 dark:text-emerald-400 mb-2 text-sm font-semibold">
                            Explanation:
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 md:p-6 rounded-lg mb-6 shadow-sm">
                  <div className="bg-slate-200 dark:bg-slate-900 px-4 py-2 rounded-md overflow-x-auto">
                    <code className="text-slate-900 dark:text-slate-100 text-sm md:text-base">
                      {problem.constraints}
                    </code>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
            <Code2 className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg">No submissions yet</p>
          </div>
        );
      case "discussion":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
            <MessageSquare className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg">No discussions yet</p>
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-slate-100 dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-sm">
                <div className="bg-slate-200 dark:bg-slate-900 px-4 py-2 rounded-md overflow-x-auto">
                  <code className="text-slate-900 dark:text-slate-100 text-sm md:text-base">
                    {problem.hints}
                  </code>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                <Lightbulb className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-lg">No hints available</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    console.log("submission -------->>>>>>>>", submission);

    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
      console.log("submission --------", submission);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-slate-300 dark:bg-slate-700 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-32 mb-2"></div>
          <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen min-w-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <nav className="bg-white dark:bg-slate-800 shadow-md px-4 py-2 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link
              to={"/"}
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <Home className="w-5 h-5" />
              <ChevronRight className="w-4 h-4" />
            </Link>
            <div className="nocopy">
              <h1 className="text-lg md:text-xl font-bold line-clamp-1">
                {problem?.title || "Loading..."}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-medium">
                  Easy
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    Updated{" "}
                    {problem?.createdAt
                      ? new Date(problem.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{submissionCount} Submissions</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  <span>95% Success Rate</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`btn btn-sm btn-ghost btn-circle ${
                isBookmarked
                  ? "text-yellow-500 dark:text-yellow-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              aria-label="Bookmark"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              className="btn btn-sm btn-ghost btn-circle text-slate-500 dark:text-slate-400"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <select
              className="select select-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {Object.keys(problem?.codeSnippets || {}).map((lang) => (
                <option key={lang} value={lang}>
                  {lang?.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      {problem && (
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-lg">
              <div className="border-b border-slate-200 dark:border-slate-700">
                <div className="flex overflow-x-auto scrollbar-hide">
                  <button
                    className={`px-4 py-3 flex items-center gap-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === "description"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                    onClick={() => setActiveTab("description")}
                  >
                    <FileText className="w-4 h-4" />
                    Description
                  </button>
                  <button
                    className={`px-4 py-3 flex items-center gap-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === "submissions"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                    onClick={() => setActiveTab("submissions")}
                  >
                    <Code2 className="w-4 h-4" />
                    Submissions
                  </button>
                  <button
                    className={`px-4 py-3 flex items-center gap-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === "discussion"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                    onClick={() => setActiveTab("discussion")}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Discussion
                  </button>
                  <button
                    className={`px-4 py-3 flex items-center gap-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === "hints"
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                    onClick={() => setActiveTab("hints")}
                  >
                    <Lightbulb className="w-4 h-4" />
                    Hints
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-6 overflow-auto max-h-[calc(100vh-16rem)]">
                {renderTabContent()}
              </div>
            </div>

            <div className="overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col">
              <div className="border-b border-slate-200 dark:border-slate-700">
                <div className="flex overflow-x-auto scrollbar-hide">
                  <button
                    className="px-4 py-3 flex items-center gap-2 text-sm font-medium whitespace-nowrap border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  >
                    <Terminal className="w-4 h-4" />
                    Code Editor
                  </button>
                </div>
              </div>

              <div className="flex-grow relative">
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme={
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? "vs-dark"
                      : "light"
                  }
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
                    fontLigatures: true,
                  }}
                />
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <div className="flex justify-between items-center">
                  <button
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm ${
                      isExecuting
                        ? "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                    } transition-colors`}
                    onClick={handleRunCode}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Code
                      </>
                    )}
                  </button>
                  <button className="px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Solution
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg mt-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold">
                {submission ? "Execution Results" : "Test Cases"}
              </h3>
            </div>
            <div className="p-4 md:p-6">
              {submission ? (
                <SubmissionResults submission={submission} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                          Test Case
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                          Input
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                          Expected Output
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {testCases.length > 0 ? (
                        testCases.map((testCase, index) => (
                          <tr
                            key={index}
                            className="hover:bg-slate-50 dark:hover:bg-slate-700/25 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 break-all">
                              <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded overflow-x-auto">
                                {testCase.input}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 break-all">
                              <div className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded overflow-x-auto">
                                {testCase.output}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-8 text-center text-slate-500 dark:text-slate-400"
                          >
                            No test cases available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;