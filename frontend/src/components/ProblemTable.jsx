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
} from "lucide-react";
import { useActionStore } from "../store/useActionStore";
import toast from "react-hot-toast";
import { usePlaylistStore } from "../store/usePlaylistStore";
import CreatePlaylistModal from "./CreatePlaylistPattern";
import AddToPlaylistModal from "./AddToPlaylist";


 
const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const { isDeletingProblem, onDeleteProblem } = useActionStore();
  const {createPlaylist} = usePlaylistStore();
  
  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];

    const tagsSet = new Set();

    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));

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
      );
  }, [problems, search, difficulty, selectedTag, isDeletingProblem, onDeleteProblem]);

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
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Coding Problems
        </h2>
        <button
          className="btn dark:bg-gray-900 bg-gradient-to-br from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 gap-2 shadow-lg"
          onClick={() => {setIsCreateModalOpen(true)}}
        >
          <Plus className="w-5 h-5" />
          Create Playlist
        </button>
      </div>
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search problems..."
          className="w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 bg-no-repeat appearance-none text-gray-900 dark:text-gray-100"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')",
            backgroundPosition: "right 1rem center",
            backgroundSize: "1em",
          }}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL" className="text-gray-600 dark:text-gray-200">
            All Difficulties
          </option>
          {difficulties.map((diff) => (
            <option
              key={diff}
              value={diff}
              className="text-gray-900 dark:text-gray-100"
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 bg-no-repeat appearance-none text-gray-900 dark:text-gray-100"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')",
            backgroundPosition: "right 1rem center",
            backgroundSize: "1em",
          }}
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL" className="text-gray-600 dark:text-gray-200">
            All Tags
          </option>
          {allTags.map((tag) => (
            <option
              key={tag}
              value={tag}
              className="text-gray-900 dark:text-gray-100"
            >
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Problems List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        {paginatedProblems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No problems found matching your criteria
          </div>
        ) : (
          paginatedProblems.map((problem) => {
            const isSolved = problem.solvedBy.some(
              (user) => user.userId === authUser?.id
            );

            return (
              <div
                key={problem.id}
                className="py-4 rounded-2xl px-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-800 transition-colors mt-2"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Solved Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSolved}
                      readOnly
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </div>

                  {/* Problem Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/problem/${problem.id}`}
                      className="text-lg font-semibold text-gray-900 dark:text-gray-50 dark:hover:text-cyan-500 hover:text-blue-600 truncate"
                    >
                      {problem.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(problem.tags || []).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div className="md:w-32">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        problem.difficulty === "EASY"
                          ? "bg-green-100 text-green-800"
                          : problem.difficulty === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {authUser?.role === "ADMIN" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(problem.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          {isDeletingProblem ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                          ) : (
                            <Trash className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          disabled
                          className="p-2 text-gray-400 cursor-not-allowed rounded-lg"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => handleAddToPlaylist(problem.id)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Bookmark className="w-5 h-5" />
                      <span className="text-sm font-medium">Save</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      <dialog
        id="my_modal_5"
        className="modal modal-bottom sm:modal-middle backdrop-blur-sm"
      >
        <div className="modal-box bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-0 max-w-md mx-auto overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600 dark:text-red-400"
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
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete this problem? All associated data
              will be permanently removed from our servers.
            </p>

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                  This action is irreversible
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
            <form method="dialog" className="flex gap-3 justify-end">
              <button
                onClick={() => document.getElementById("my_modal_5").close()}
                type="button"
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                id="delete-button"
                type="submit"
                className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200 shadow-sm"
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

