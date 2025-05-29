import { useEffect, useState } from "react";
import { useDiscussionStore } from "../store/useDiscussionStore";
import {
  ArrowDown,
  ArrowUp,
  MessageCircle,
  MessageSquare,
  Plus,
  ThumbsUp,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export default function DiscussionList({ problemId }) {
  const { authUser } = useAuthStore();
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [showCommentTextbox, setShowCommentTextbox] = useState({});
  const [commentText, setCommentText] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    discussions,
    discussion: disc,
    fetchDiscussion,
    fetchDiscussions,
    toggleLike,
    addCommentToDiscussion,
    addDiscussion,
  } = useDiscussionStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(
      z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        content: z.string().min(10, "Content must be at least 10 characters"),
      })
    ),
  });

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await addDiscussion(problemId, data);
      setShowModal(false);
      reset();
      await fetchDiscussions(problemId);
    } catch (error) {
      console.error("Error adding discussion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDiscussions(problemId);
  }, [problemId, fetchDiscussions]);

  const addComment = async (discussionId) => {
    const content = commentText[discussionId]?.trim();
    if (!content) return;

    try {
      // Send as JSON object instead of FormData
      await addCommentToDiscussion(discussionId, { content });
      
      // Clear the comment text
      setCommentText(prev => ({ ...prev, [discussionId]: "" }));
      setShowCommentTextbox(prev => ({ ...prev, [discussionId]: false }));
      
      // Refresh discussions
      await fetchDiscussions(problemId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleComments = (discussionId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(discussionId)) {
        newSet.delete(discussionId);
      } else {
        newSet.add(discussionId);
        fetchDiscussion(discussionId);
      }
      return newSet;
    });
  };

  const toggleCommentTextbox = (discussionId) => {
    setShowCommentTextbox(prev => ({
      ...prev,
      [discussionId]: !prev[discussionId]
    }));
  };

  const handleCommentChange = (discussionId, value) => {
    setCommentText(prev => ({
      ...prev,
      [discussionId]: value
    }));
  };

  return (
    <div className="space-y-6">
      {discussions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No discussions yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-sm">
              Be the first to start a discussion about this problem
            </p>
          </div>
        </div>
      )}

      {discussions.map((discussion) => (
        <div
          key={discussion.id}
          className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-[#0e0e0e] shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            {/* Discussion Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 overflow-hidden rounded-full mr-3 ring-2 ring-gray-100 dark:ring-gray-700">
                  <img
                    src={discussion.user.image}
                    alt={discussion.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {discussion.user.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(discussion.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Discussion Content */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {discussion.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {discussion.content}
              </p>
            </div>

            {/* Discussion Actions */}
            <div className="flex items-center gap-6 py-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => toggleLike(discussion.id, authUser.id)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <ThumbsUp size={18} />
                <span className="font-medium">{discussion.likes.length}</span>
              </button>
              
              <button
                onClick={() => toggleComments(discussion.id)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
              >
                <MessageCircle size={18} />
                <span className="font-medium">{discussion.comments.length} comments</span>
                {expandedComments.has(discussion.id) ? (
                  <ArrowUp size={16} />
                ) : (
                  <ArrowDown size={16} />
                )}
              </button>
            </div>

            {/* Comments Section */}
            {expandedComments.has(discussion.id) && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                {discussion.comments?.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {discussion.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 overflow-hidden rounded-full ring-1 ring-gray-200 dark:ring-gray-700">
                          <img
                            src={comment.user.image}
                            alt={comment.user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                            {comment.user.name}
                          </div>
                          <div className="text-gray-700 dark:text-gray-300">
                            {comment.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                )}

                {/* Add Comment */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  {!showCommentTextbox[discussion.id] ? (
                    <button
                      onClick={() => toggleCommentTextbox(discussion.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                    >
                      <Plus size={18} />
                      <span>Add a comment</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 overflow-hidden rounded-full ring-1 ring-gray-200 dark:ring-gray-700">
                          <img
                            src={authUser.image}
                            alt={authUser.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={commentText[discussion.id] || ""}
                            onChange={(e) => handleCommentChange(discussion.id, e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            rows="3"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => toggleCommentTextbox(discussion.id)}
                          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => addComment(discussion.id)}
                          disabled={!commentText[discussion.id]?.trim()}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Start Discussion Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Start Discussion
        </button>
      </div>

      {/* Discussion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0e0e0e] rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Start a Discussion
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter discussion title"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Content
                  </label>
                  <textarea
                    {...register("content")}
                    rows="5"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Share your thoughts about this problem..."
                  />
                  {errors.content && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Posting..." : "Post Discussion"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}