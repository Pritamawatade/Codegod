import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Trash,
  Plus,
  Loader2,
  Search,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  ListPlus,
  X,
} from "lucide-react";
import { useActionStore } from "../store/useActionStore";
import toast from "react-hot-toast";
import { usePlaylistStore } from "../store/usePlaylistStore";
import CreatePlaylistModal from "./CreatePlaylistPattern";
import AddToPlaylistModal from "./AddToPlaylist";

const DIFF_STYLE = {
  EASY: "text-emerald-600 dark:text-emerald-400",
  MEDIUM: "text-amber-600 dark:text-amber-400",
  HARD: "text-rose-600 dark:text-rose-400",
};

const ProblemTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const { isDeletingProblem, onDeleteProblem } = useActionStore();
  const { createPlaylist } = usePlaylistStore();

  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const s = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => s.add(t)));
    return Array.from(s).slice(0, 30);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => (difficulty === "ALL" ? true : p.difficulty === difficulty))
      .filter((p) => (selectedTag === "ALL" ? true : p.tags?.includes(selectedTag)));
  }, [problems, search, difficulty, selectedTag]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, difficulty, selectedTag]);

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filteredProblems.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await onDeleteProblem(pendingDelete);
      toast.success("Problem deleted");
    } catch {
      toast.error("Failed to delete problem");
    } finally {
      setPendingDelete(null);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setDifficulty("ALL");
    setSelectedTag("ALL");
  };
  const hasFilters = search || difficulty !== "ALL" || selectedTag !== "ALL";

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems…"
            className="h-10 w-full rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] pl-9 pr-8 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:focus:border-white/30"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty segmented */}
          <div className="flex h-10 items-center gap-0.5 rounded-lg border border-zinc-200 dark:border-white/10 p-1">
            {["ALL", "EASY", "MEDIUM", "HARD"].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`h-full rounded-md px-2.5 text-xs font-semibold transition-colors ${
                  difficulty === d
                    ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {d === "ALL" ? "All" : d[0] + d.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="h-10 max-w-[150px] truncate rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e] px-3 text-[13px] font-medium outline-none"
          >
            <option value="ALL">All topics</option>
            {allTags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg bg-zinc-950 dark:bg-white px-3.5 text-[13px] font-semibold text-white dark:text-zinc-950 transition-opacity hover:opacity-85"
          >
            <ListPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Playlist</span>
          </button>

          {authUser?.role === "ADMIN" && (
            <Link
              to="/add-problem"
              className="flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg border border-zinc-200 dark:border-white/10 px-3.5 text-[13px] font-semibold transition-colors hover:bg-zinc-50 dark:hover:bg-white/5"
            >
              <Plus className="h-4 w-4" /> <span className="hidden sm:inline">New</span>
            </Link>
          )}
        </div>
      </div>

      {hasFilters && (
        <div className="mt-3 flex items-center gap-2 text-[13px] text-zinc-500">
          <span>{filteredProblems.length} result{filteredProblems.length === 1 ? "" : "s"}</span>
          <button onClick={clearFilters} className="font-semibold text-zinc-900 dark:text-white hover:underline">Clear filters</button>
        </div>
      )}

      {/* List */}
      <div className="card-surface mt-3 overflow-hidden">
        <div className="hidden grid-cols-[28px_1fr_110px_40px] items-center gap-3 border-b border-zinc-200 dark:border-white/[0.07] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 sm:grid">
          <span>Status</span><span>Title</span><span className="text-right">Difficulty</span><span />
        </div>

        {paginated.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-semibold">No problems found</p>
            <p className="mx-auto mt-1 max-w-xs text-[13px] text-zinc-500">Try a different search or clear your filters to see the full set.</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-4 rounded-lg border border-zinc-200 dark:border-white/10 px-4 py-2 text-[13px] font-semibold hover:bg-zinc-50 dark:hover:bg-white/5">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-white/[0.06]">
            {paginated.map((problem) => {
              const isSolved = problem.solvedBy?.some((u) => u.userId === authUser?.id);
              return (
                <div key={problem.id} className="group grid grid-cols-[28px_1fr_40px] sm:grid-cols-[28px_1fr_110px_40px] items-center gap-3 px-4 sm:px-5 py-3 transition-colors hover:bg-zinc-50/80 dark:hover:bg-white/[0.03]">
                  <span>
                    {isSolved ? (
                      <CheckCircle2 className="h-[18px] w-[18px] text-emerald-500" />
                    ) : (
                      <Circle className="h-[18px] w-[18px] text-zinc-300 dark:text-zinc-700" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <Link to={`/problem/${problem.id}`} className="block truncate text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-300">
                      {problem.title}
                    </Link>
                    {(problem.tags?.length > 0) && (
                      <div className="mt-1 hidden flex-wrap gap-1 sm:flex">
                        {problem.tags.slice(0, 3).map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="rounded bg-zinc-100 dark:bg-white/[0.06] px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                    <span className={`mt-0.5 block text-xs font-semibold sm:hidden ${DIFF_STYLE[problem.difficulty] || ""}`}>
                      {problem.difficulty?.[0] + problem.difficulty?.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <span className={`hidden text-right text-[13px] font-medium sm:block ${DIFF_STYLE[problem.difficulty] || ""}`}>
                    {problem.difficulty?.[0] + problem.difficulty?.slice(1).toLowerCase()}
                  </span>
                  <span className="flex justify-end gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {authUser?.role === "ADMIN" && (
                      <button
                        onClick={() => setPendingDelete(problem.id)}
                        title="Delete"
                        className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => { setSelectedProblemId(problem.id); setIsAddToPlaylistModalOpen(true); }}
                      title="Save to playlist"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-[13px] text-zinc-500">Page {safePage} of {totalPages} · {filteredProblems.length} problems</p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={safePage === 1}
              onClick={() => setCurrentPage(safePage - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/10 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-white/5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-white/10 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-white/5"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {pendingDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-sm" onClick={() => setPendingDelete(null)}>
          <div className="animate-modalshow w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111113] p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[15px] font-semibold tracking-tight">Delete this problem?</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500">This removes the problem and all associated data. This can't be undone.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setPendingDelete(null)} className="h-9 rounded-lg border border-zinc-200 dark:border-white/10 px-4 text-[13px] font-semibold hover:bg-zinc-50 dark:hover:bg-white/5">Cancel</button>
              <button onClick={confirmDelete} disabled={isDeletingProblem} className="flex h-9 items-center gap-2 rounded-lg bg-rose-600 px-4 text-[13px] font-semibold text-white hover:bg-rose-700 disabled:opacity-60">
                {isDeletingProblem && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createPlaylist}
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
