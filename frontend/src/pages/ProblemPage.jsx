import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
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
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  CheckCircle2,
  XCircle,
  ThumbsDown,
  Info,
  Check,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

import useProblemStore from "../store/useProblemStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { getLanguageId } from "../lib/lang";
import SubmissionResults from "../components/Submission";
import { useAuthStore } from "../store/useAuthStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import toast from "react-hot-toast";
import SubmissionList from "../components/SubmissionsList";
import { get } from "react-hook-form";
import useThemeStore from "../store/useThemeStore";
import Tooltip from "../components/Tooltip";
import DiscussionList from "../components/DiscussionList";
import SubmissionResultCard from "../components/SubmissionResultCard";

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
  const {
    submissionForProblem,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const { theme } = useThemeStore();
  const { authUser } = useAuthStore();
  const {
    executeCode,
    submission,
    isExecuting,
    isSubmitting,
    submitResult,
    submitCode,
  } = useExecutionStore();

  if (!authUser) {
    Navigate("/login");
  }
  useEffect(() => {
    getProblemById(id);
    setCode(problem?.codeSnippets?.[selectedLanguage] || "");
    getSubmissionCountForProblem(id);
    getLikesAndDislikes(id);
  }, [id]);
  useEffect(() => {
    getProblemById(id);
  }, []);
  useEffect(() => {
    const exitOnEsc = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("keydown", exitOnEsc);
    return () => document.removeEventListener("keydown", exitOnEsc);
  }, [isFullscreen]);

  // ⛔ Disable all shortcuts
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
        toast.error(`for your own good "${e.key}" is disabled`);
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

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");
      setTestCases(
        problem.testCases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
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

  

  useEffect(() => {
    if (activeTab == "submissions") {
      getSubmissionForProblem(id);
    }
  }, [activeTab]);

  // React.useMemo(getSubmissionForProblem(id), [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="min-h-full text-sm">
            <div className="prose prose-gray min-h-full dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                {problem.description}
              </p>
            </div>

            {problem.examples && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Examples
                </h3>
                <div className="space-y-6">
                  {Object.entries(problem.examples).map(
                    ([lang, example], idx) => (
                      <div
                        key={lang}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <div className="p-4 space-y-4">
                          {/* Input Section */}
                          <div>
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Input:
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0e0e0e] border border-gray-200 dark:border-gray-800 rounded-md p-3">
                              <code className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                                {example.input}
                              </code>
                            </div>
                          </div>

                          {/* Output Section */}
                          <div>
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Output:
                            </div>
                            <div className="bg-gray-50 dark:bg-[#0e0e0e] border border-gray-200 dark:border-gray-800 rounded-md p-3">
                              <code className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                                {example.output}
                              </code>
                            </div>
                          </div>

                          {/* Explanation Section */}
                          {example.explanation && (
                            <div>
                              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Explanation:
                              </div>
                              <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {example.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {problem.constraints && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Constraints
                </h3>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="bg-gray-50 dark:bg-[#0e0e0e] border border-gray-200 dark:border-gray-800 rounded-md p-3">
                      <code className="text-sm font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                        {problem.constraints}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "submissions":
        return isSubmitting ? (
          <div>Submitting...</div>
        ) : submitResult ? (
          <SubmissionResultCard submission={submitResult} />
        ) : (
          "No submissions yet"
        );

      case "discussion":
        return <DiscussionList problemId={id} />;

      case "hints":
        return (
          <div>
            {problem?.hints ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Hint
                    </h3>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-md p-4">
                    <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {problem.hints}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Lightbulb className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No hints available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Try solving this problem without hints first
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };
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
      // Ctrl + '
      if (e.ctrlKey && e.key === "'") {
        e.preventDefault(); // Prevent any default behavior
        handleRunCode();
      }

      // Ctrl + Enter
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleSubmitCode();
      }
    };

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleRunCode, handleSubmitCode]);



  if (isProblemLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="h-4 bg-blue-500 rounded w-32 mb-2 animate-pulse"></div>
          <div className="h-3 bg-blue-500 rounded w-24 animate-pulse"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-w-screen h-screen overflow-hidden bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-slate-100">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-2 sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
        <div className=" mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Breadcrumb and Problem Info */}
          <div className="flex flex-col w-full md:w-auto">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Link
                  to={"/problems"}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Home className="w-5 h-5 flex-shrink-0" />
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                </Link>

                <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                  {problem?.title || "Loading..."}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    problem?.difficulty === "Easy"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                      : problem?.difficulty === "Medium"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                  }`}
                >
                  {problem?.difficulty || "Easy"}
                </span>
                </div>
              </div>
              
              {/* Like/Dislike buttons moved to top */}
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
                  onClick={() => submitFeedback(true)}
                >
                  <ThumbsUp
                    className="w-4 h-4 transition-colors duration-200"
                    strokeWidth={liked ? 0 : 1.5}
                    fill={liked ? "#10b981" : "none"}
                    stroke={liked ? "#10b981" : "#6b7280"}
                  />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                    {likes}
                  </span>
                </button>

                <button
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 group"
                  onClick={() => submitFeedback(false)}
                >
                  <ThumbsDown
                    className="w-4 h-4 transition-colors duration-200"
                    strokeWidth={liked === false ? 0 : 1.5}
                    fill={liked === false ? "#ef4444" : "none"}
                    stroke={liked === false ? "#ef4444" : "#6b7280"}
                  />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                    {dislikes}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3">
              {/* Run and Submit Buttons */}
              <div className="flex items-center gap-3">
                <button
                  className={`px-4 py-2 rounded-md flex items-center gap-2 font-medium text-sm transition-all duration-200 ${
                    isExecuting
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                  }`}
                  onClick={handleRunCode}
                  disabled={isExecuting}
                >
                  {isExecuting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Run Code</span>
                    </>
                  )}
                </button>

                <button
                  className={`px-4 py-2 rounded-md flex items-center gap-2 font-medium text-sm transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                  }`}
                  onClick={handleSubmitCode}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Submit</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 ml-2">
                <button
                  className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                    isBookmarked
                      ? "text-yellow-500 dark:text-yellow-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  aria-label="Bookmark"
                >
                  <Bookmark className="w-5 h-5" />
                </button>

                <button
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-500 dark:text-gray-400"
                  aria-label="Share"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("URL copied to clipboard");
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <div className="relative">
                  <select
                    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400 appearance-none sm:text-sm"
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                  >
                    {Object.keys(problem?.codeSnippets || {}).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang?.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <ChevronDown className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {problem && (
        <div className="container dark:bg-gray-950 h-[calc(100vh-56px)] min-w-screen overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-full">
            <Split
              className="min-w-screen split"
              minSize={100}
              gutterSize={4}
              snapOffset={0}
              dragInterval={2}
            >
              <div className="bg-white dark:bg-black rounded-xl shadow-lg text-sm h-full flex flex-col">
                <div className="border-b border-slate-200 dark:border-slate-700">
                  <div className="flex ">
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

                <div className="p-4 dark:bg-black md:p-6 overflow-auto flex-grow overflow-y-auto" style={{maxHeight: "calc(100vh - 150px)"}}>
                  {renderTabContent()}
                  {/* Feedback Section */}
                </div>
                {/* Removed like/dislike buttons from bottom as they're now at the top */}
              </div>

              <div className="flex flex-col h-full">
                <Split
                  className="min-w-full flex flex-col h-full split1"
                  minSize={200}
                  gutterSize={4}
                  snapOffset={0}
                  dragInterval={2}
                  direction="vertical"
                >
                  <div className="pt-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg flex flex-col h-3/5">
                    <div className="border-b border-slate-200 dark:border-slate-700">
                      <div className="flex overflow-x-auto items-start scrollbar-hide">
                        <button className="flex items-start gap-2 text-sm font-medium whitespace-nowrap border-b-2 border-blue-500 text-blue-600 dark:text-blue-400">
                          <Terminal className="w-4 h-4" />
                          Code Editor
                        </button>
                      </div>
                    </div>

                    <div
                      ref={wrapperRef}
                      className={`${
                        isFullscreen
                          ? "fixed inset-0 z-[9999] bg-white dark:bg-gray-900 w-screen h-screen"
                          : "relative h-full bg-white dark:bg-gray-950 rounded-xl shadow flex-grow w-full pt-2"
                      } transition-all duration-300`}
                    >
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="absolute top-4 right-4 z-[9999] p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                      >
                        {isFullscreen ? (
                          <Minimize2 size={18} />
                        ) : (
                          <Maximize2 size={18} />
                        )}
                      </button>
                      <Editor
                        className="w-full h-full"
                        height="100%"
                        language={selectedLanguage.toLowerCase()}
                        theme={
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "vs-dark"
                            : "light"
                        }
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineNumbers: "on",
                          roundedSelection: false,
                          scrollBeyondLastLine: false,
                          readOnly: false,
                          automaticLayout: true,
                          fontFamily:
                            "'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
                          fontLigatures: true,
                        }}
                      />
                    </div>
                  </div>

                  <div className="z-40 bg-white dark:bg-[#000000] shadow-lg mt-1 overflow-y-auto h-2/5">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-bold">
                        {submission ? "Execution Results" : "Test Cases"}
                      </h3>
                    </div>
                    <div className="p-4 md:p-6">
                      {submission ? (
                        <SubmissionResults submission={submission} />
                      ) : (
                        <div className="w-full">
                          {/* Test Case Tabs */}
                          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                            {testCases.length > 0 ? (
                              testCases.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setActiveTestCase(index)}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                                    ${activeTestCase === index 
                                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                  Test Case {index + 1}
                                </button>
                              ))
                            ) : (
                              <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                                No test cases available
                              </div>
                            )}
                          </div>

                          {/* Active Test Case Content */}
                          {testCases.length > 0 && (
                            <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Input:
                                </div>
                                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 font-mono text-sm overflow-x-auto">
                                  <code className="text-slate-700 dark:text-slate-300">
                                    {testCases[activeTestCase]?.input}
                                  </code>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Expected Output:
                                </div>
                                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 font-mono text-sm overflow-x-auto">
                                  <code className="text-slate-700 dark:text-slate-300">
                                    {testCases[activeTestCase]?.output}
                                  </code>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Split>
              </div>
            </Split>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
