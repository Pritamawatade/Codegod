import React, { useState, useMemo, use } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Bookmark,
  PencilIcon,
  Trash,
  TrashIcon,
  Plus,
  Loader2,
  Search,
  Filter,
  Tag,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useActionStore } from "../store/useActionStore";
import toast from "react-hot-toast";
import { usePlaylistStore } from "../store/usePlaylistStore";
import CreatePlaylistModal from "./CreatePlaylistPattern";
import AddToPlaylistModal from "./AddToPlaylist";
import Button from "./Button";

const selectStyles = `
    w-full pl-12 pr-10 py-3 
    border border-gray-200 dark:border-gray-700 
    rounded-xl 
    bg-white dark:bg-gray-900 
    text-gray-900 dark:text-gray-100 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    appearance-none cursor-pointer 
    transition-all duration-200 
    hover:border-gray-300 dark:hover:border-gray-600
    shadow-sm hover:shadow-md
    text-sm font-medium
  `;

const iconStyles =
  "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 z-10";
const chevronStyles =
  "absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none";

const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [company, setCompany] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const { isDeletingProblem, onDeleteProblem } = useActionStore();
  const { createPlaylist } = usePlaylistStore();

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];

    const tagsSet = new Set();

    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));

    return Array.from(tagsSet);
  }, [problems]);

  const companyTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];

    const tagsSet = new Set();

    problems.forEach((p) => p.companyTags?.forEach((t) => tagsSet.add(t)));

    return Array.from(tagsSet);
  }, [problems]);

  const handleDelete = (id) => {
    document.getElementById("my_modal_5").showModal();
    const deleteButton = document.getElementById("delete-button");
    deleteButton.addEventListener("click", () => {
      deleteProblem(id);
      document.getElementById("my_modal_5").close();
    });
  };

  const deleteProblem = (id) => {
    try {
      onDeleteProblem(id);
    } catch (error) {
      console.log("error in delete Problem ", error);
      toast.error("error in deleting problem");
    }
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      )
      .filter((problem) =>
        company === "ALL" ? true : problem.companyTags?.includes(company)
      );
  }, [
    problems,
    search,
    difficulty,
    selectedTag,
    isDeletingProblem,
    onDeleteProblem,
    company,
  ]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage, // 1 * 5 = 5 ( starting index = 0)
      currentPage * itemsPerPage // 1 * 5  = (0 , 10)
    );
  }, [
    filteredProblems,
    currentPage,
    handleDelete,
    onDeleteProblem,
    isDeletingProblem,
  ]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const handleEdit = (id) => {};

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
            Problems
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Practice coding problems and track your progress
          </p>
        </div>
        {/* <button
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 gap-2"
          onClick={() => {setIsCreateModalOpen(true)}}
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </button> */}
        <Button
          onClick={() => {
            setIsCreateModalOpen(true);
          }}
          buttonText="Create Playlist"
          Icon={Plus}
        />
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Search Input */}
        <div className="relative">
          <Search className={iconStyles} />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Difficulty Select */}
        <div className="relative">
          <Filter className={iconStyles} />
          <select
            className={selectStyles}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            <option value="ALL">All Difficulties</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff} className="py-2">
                {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <ChevronDown className={chevronStyles} />
        </div>

        {/* Tags Select */}
        <div className="relative">
          <Tag className={iconStyles} />
          <select
            className={selectStyles}
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            style={{
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            <option value="ALL">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag} className="py-2">
                {tag}
              </option>
            ))}
          </select>
          <ChevronDown className={chevronStyles} />
        </div>

        {/* Company Select */}
        <div className="relative">
          <Building2 className={iconStyles} />
          <select
            className={selectStyles}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            <option value="ALL">All Companies</option>
            {companyTags.map((tag) => (
              <option key={tag} value={tag} className="py-2">
                {tag}
              </option>
            ))}
          </select>
          <ChevronDown className={chevronStyles} />
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white dark:bg-[#0e0e0e] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        {paginatedProblems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-sm">
              No problems found matching your criteria
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {paginatedProblems.map((problem, index) => {
              const isSolved = problem.solvedBy.some(
                (user) => user.userId === authUser?.id
              );

              return (
                <div
                  key={problem.id}
                  className={`group hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-150 ${
                    index === 0 ? "" : ""
                  }`}
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left Section: Checkbox + Problem Info */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        {/* Solved Checkbox */}
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isSolved}
                            readOnly
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </div>

                        {/* Problem Title and Tags */}
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/problem/${problem.id}`}
                            className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm sm:text-base transition-colors duration-200 block truncate"
                          >
                            {problem.title}
                            {problem.title === "Add Two Numbers" && (
                              <span className="inline-flex items-center px-2 py-0.5 ml-6 rounded text-xs font-medium bg-green-600 text-gray-700 dark:text-gray-300">
                                demo
                              </span>
                            )}
                          </Link>
                          {(problem.tags || []).length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {(problem.tags || [])
                                .slice(0, 3)
                                .map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              {(problem.tags || []).length > 3 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                  +{(problem.tags || []).length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section: Difficulty + Actions */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Difficulty Badge */}
                        <div className="hidden sm:block">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              problem.difficulty === "EASY"
                                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                                : problem.difficulty === "MEDIUM"
                                ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                                : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          {authUser?.role === "ADMIN" && (
                            <>
                              <button
                                onClick={() => handleDelete(problem.id)}
                                className="p-2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                                title="Delete problem"
                              >
                                {isDeletingProblem ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                disabled
                                className="p-2 text-gray-300 dark:text-gray-600 cursor-not-allowed rounded-lg"
                                title="Edit problem (coming soon)"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleAddToPlaylist(problem.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                            title="Add to playlist"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Difficulty Badge */}
                    <div className="sm:hidden mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          problem.difficulty === "EASY"
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                            : problem.difficulty === "MEDIUM"
                            ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                            : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0e0e0e] border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <button
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0e0e0e] border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <dialog
        id="my_modal_5"
        className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
      >
        <div className="modal-box bg-white dark:bg-[#0e0e0e] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-0 max-w-md mx-auto overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Problem
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Are you sure you want to delete this problem? All associated data
              will be permanently removed.
            </p>

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-lg">
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  This action is irreversible
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <form method="dialog" className="flex gap-3 justify-end">
              <button
                onClick={() => document.getElementById("my_modal_5").close()}
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#0e0e0e] border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                id="delete-button"
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
              >
                Delete Problem
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemTable;
