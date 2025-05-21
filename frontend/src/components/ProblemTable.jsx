import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, TrashIcon, Plus } from "lucide-react";

const ProblemTable = ({ problems }) => {
 const { authUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];

    const tagsSet = new Set();

    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));

    return Array.from(tagsSet);
  }, [problems]);


  const filteredProblems = useMemo(()=>{
    return (problems || [])
    .filter((problem)=> problem.title.toLowerCase().includes(search.toLowerCase()))
    .filter((problem)=>difficulty === "ALL" ? true: problem.difficulty === difficulty)
     .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  },[problems , search , difficulty , selectedTag])

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage, // 1 * 5 = 5 ( starting index = 0)
      currentPage * itemsPerPage // 1 * 5  = (0 , 10)
    );
  }, [filteredProblems, currentPage]);


  const difficulties = ["EASY", "MEDIUM", "HARD"];

  const handleDelete = (id)=>{}

  const handleAddToPlaylist = (id)=>{}
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Coding Problems
        </h2>
        <button
          className="btn dark:bg-gray-900 bg-gradient-to-br from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 gap-2 shadow-lg"
          onClick={() => {}}
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
          style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')", backgroundPosition: "right 1rem center", backgroundSize: "1em" }}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="ALL" className="text-gray-600 dark:text-gray-200">All Difficulties</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff} className="text-gray-900 dark:text-gray-100">
              {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        <select
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 bg-no-repeat appearance-none text-gray-900 dark:text-gray-100"
          style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')", backgroundPosition: "right 1rem center", backgroundSize: "1em" }}
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="ALL" className="text-gray-600 dark:text-gray-200">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag} className="text-gray-900 dark:text-gray-100">
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
            const isSolved = problem.solvedBy.some((user) => user.userId === authUser?.id);

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
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
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
    </div>
  );
};

export default ProblemTable;