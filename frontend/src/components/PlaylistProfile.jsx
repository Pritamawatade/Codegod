import React, { useEffect, useState } from 'react';
import { usePlaylistStore } from '../store/usePlaylistStore';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronDown, ChevronUp, Clock, List, Tag, ExternalLink, Plus, Trash2, Play, Library, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatePlaylistModal from './CreatePlaylistPattern';

const PlaylistProfile = () => {
const { getAllPlaylists, playlists, deletePlaylist, createPlaylist } = usePlaylistStore();
const [expandedPlaylist, setExpandedPlaylist] = useState(null);
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [pendingDeleteId, setPendingDeleteId] = useState(null);

// Handle create playlist
const handleCreatePlaylist = async (data) => {
  try {
    await createPlaylist(data);
    await getAllPlaylists();
  } catch (error) {
    console.error("Error creating playlist", error);
    toast.error("Failed to create playlist");
  }
};

// Handle click on delete button (opens modal)
const handleDelete = (id) => {
  setPendingDeleteId(id);
  document.getElementById("my_modal_6").showModal();
};

// Actually deletes playlist
const confirmDelete = async () => {
  try {
    if (!pendingDeleteId) return;
    await deletePlaylist(pendingDeleteId);
    await getAllPlaylists();
    toast.success("Playlist deleted successfully");
  } catch (error) {
    console.error("Error deleting playlist", error);
    toast.error("Error deleting playlist");
  } finally {
    document.getElementById("my_modal_6").close();
    setPendingDeleteId(null);
  }
};

useEffect(() => {
  try {
    getAllPlaylists();
  } catch (error) {
    console.error("Error loading playlists", error);
    toast.error("Failed to load playlists");
  }
}, [getAllPlaylists]);

const togglePlaylist = (id) => {
  setExpandedPlaylist(prev => prev === id ? null : id);
};
  

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
            Easy
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
            Medium
          </span>
        );
      case 'HARD':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
            Hard
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            Unknown
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-gray-50/30 to-indigo-50/30 dark:from-[#0b1018] dark:via-[#0b1018] dark:to-[#0b1018] dark:bg-[#0b1018] transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-full w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-lg">
              <Library className="w-6 h-6 text-black dark:text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold dark:text-white text-black">
                My Playlists
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Organize and track your coding journey
              </p>
            </div>
          </div>
          <button
           onClick={() => {setIsCreateModalOpen(true)}}
          className="group bg-gradient-to-r border bg-gray-100 dark:bg-[#0b1018] dark:border-gray-100 dark:hover:to-gray-900 text-black dark:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform cursor-pointer shadow-lg hover:shadow-xl flex items-center gap-2">
            <Plus className="w-4 h-4  group-hover:rotate-90 transition-transform duration-300" />
            Create Playlist
          </button>
        </div>

        {playlists.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Code2 className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No playlists yet</h3>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-8 max-w-md">
              Create your first playlist to organize problems and track your progress on your coding journey!
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Playlist
            </button>
          </div>
        ) : (
          /* Playlists Grid */
          <div className="grid gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="group bg-white/70 dark:bg-[#0b1018] backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl dark:shadow-gray-900/20 border border-slate-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-[1.01] overflow-hidden"
              >
                {/* Playlist Header */}
                <div className="p-6">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => togglePlaylist(playlist.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-[#eaeaea] dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <Code2 className="w-8 h-8 text-gray-500 dark:text-gray-200" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{playlist?.problems?.length}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {playlist.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                            <List className="w-3.5 h-3.5" />
                            <span className="font-medium">{playlist?.problems?.length} problems</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Created {formatDate(playlist.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="w-10 h-10 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      {expandedPlaylist === playlist.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  {playlist.description && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl border border-slate-200/50 dark:border-gray-600/50">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {playlist.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Expanded Problems List */}
                {expandedPlaylist === playlist.id && (
                  <div className="border-t border-slate-200 dark:border-gray-700 bg-slate-50/50 dark:bg-[#0b1018]">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          Problems in this playlist
                        </h4>
                        <span className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-full border border-slate-200 dark:border-gray-600">
                          {playlist.problems.length} total
                        </span>
                      </div>

                      {playlist.problems.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-slate-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 font-medium">No problems added yet</p>
                          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Start adding problems to organize your practice</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {playlist.problems.map((item, index) => (
                            <div
                              key={item.id}
                              className="group/item bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-200 dark:border-gray-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 dark:text-slate-300 text-sm font-bold shadow-sm">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-slate-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                                      {item.problem.title}
                                    </h5>
                                    <div className="flex items-center gap-3 mt-2">
                                      {getDifficultyBadge(item.problem.difficulty)}
                                      <div className="flex flex-wrap gap-1.5">
                                        {item.problem.tags && item.problem.tags.slice(0, 3).map((tag, idx) => (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-gray-600"
                                          >
                                            <Tag className="w-2.5 h-2.5" />
                                            {tag}
                                          </span>
                                        ))}
                                        {item.problem.tags && item.problem.tags.length > 3 && (
                                          <span className="text-xs text-slate-500 dark:text-slate-400 px-2">
                                            +{item.problem.tags.length - 3} more
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <Link
                                  to={`/problem/${item.problem.id}`}
                                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform  flex items-center gap-2 border border-slate-200 dark:border-gray-700"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Solve
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Playlist Actions */}
                      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-gray-700">
                        <button
                          onClick={() => handleDelete(playlist.id)}
                          className="group/delete bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 border border-red-200 dark:border-red-800"
                        >
                          <Trash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform" />
                          Delete Playlist
                        </button>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Last updated {formatDate(playlist.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
         <dialog
        id="my_modal_6"
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
                  Delete playlist
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
              Are you sure you want to delete this playlist? All associated data
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
                onClick={() => document.getElementById("my_modal_6").close()}
                type="button"
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                id="delete-playlist-button"
                type="submit"
                onClick={confirmDelete}
                className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200 shadow-sm"
              >
                Delete Playlist
              </button>
            </form>
          </div>
        </div>
      </dialog>

            <CreatePlaylistModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreatePlaylist}
            />
    </div>
  );
};

export default PlaylistProfile;