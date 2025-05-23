import React from 'react';
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Modal Backdrop: semi-transparent background
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      {/* Modal Panel */}
      <div className="bg-white dark:bg-[#0b1018] rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalshow">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#3a3a40]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Create New Playlist</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#3a3a40] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-offset-[#0b1018]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          <div>
            <label htmlFor="playlistName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Playlist Name
            </label>
            <input
              id="playlistName"
              type="text"
              className="w-full p-2.5 rounded-md border bg-gray-50 dark:bg-[#3a3a40] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter playlist name"
              {...register('name', { required: 'Playlist name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="playlistDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="playlistDescription"
              className="w-full p-2.5 rounded-md border bg-gray-50 dark:bg-[#3a3a40] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:border-blue-500 placeholder-gray-400 dark:placeholder-gray-500 h-24 resize-none"
              placeholder="Enter playlist description"
              {...register('description')}
            />
          </div>

          {/* Modal Footer - Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 cursor-pointer px-4 rounded-md border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-blue-500 dark:bg-[#3a3a40] dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:ring-offset-[#0b1018]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 cursor-pointer px-4 rounded-md border border-transparent text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-500 dark:focus:ring-offset-[#0b1018]"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
  
      
    </div>
  );
};

export default CreatePlaylistModal;
