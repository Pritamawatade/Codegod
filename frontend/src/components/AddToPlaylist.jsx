import React, { useEffect, useState } from 'react';
import { X, Plus, Loader } from 'lucide-react';
import { usePlaylistStore } from '../store/usePlaylistStore';

const AddToPlaylistModal = ({ isOpen, onClose, problemId }) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } = usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  useEffect(() => {
    if (isOpen) {
      getAllPlaylists();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;

    await addProblemToPlaylist(selectedPlaylist, [problemId]);
    onClose();
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 dark:bg-opacity-90 flex items-center justify-center z-50 p-4">
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out scale-100 opacity-100">
    <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Add to Playlist
      </h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>
    </div>

    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="flex flex-col">
        <label
          htmlFor="playlist-select"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Select Playlist
        </label>
        <div className="relative">
          <select
            id="playlist-select"
            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 appearance-none pr-10 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            value={selectedPlaylist}
            onChange={(e) => setSelectedPlaylist(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Select a playlist</option>
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-base font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-200 text-base font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!selectedPlaylist || isLoading}
        >
          {isLoading ? (
            <Loader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add to Playlist
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default AddToPlaylistModal;