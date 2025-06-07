import { use, useEffect, useState } from "react";
import { useDiscussionStore } from "../store/useDiscussionStore";
import {
  ArrowDown,
  MessageCircle,
  MessageSquare,
  Plus,
  ThumbsUp,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Tooltip from "./Tooltip";
export default function DiscussionList({ problemId }) {
  const { authUser } = useAuthStore();
  const [activeTextboxId, setActiveTextboxId] = useState(null); // track which comment box is open
  const [comment, setComment] = useState(""); // single comment input
  const [isCommentVisible, setIscommentVisible] = useState(false); // if needed for full comments

  const [showModal, setShowModal] = useState(false);

  const {
    discussions,
    discussion: disc,
    fetchDiscussion,
    fetchDiscussions,
    toggleLike,
    addCommentToDiscussion,
    addDiscussion,
  } = useDiscussionStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        content: z.string().min(10, "Content must be at least 10 characters"),
      })
    ),
  });


  const onSubmit = async (data) => {
    try {
      await addDiscussion(problemId, data);
      setShowModal(false);
    } catch (error) {
      console.log("error in adding discussion", error);
    }
  };

  const addComment = (id, content) => {
    setActiveTextboxId(true);
    const data = { content };
    addCommentToDiscussion(id, data);
    fetchDiscussions(problemId);
  };

  const showComments = (id) => {
    setIscommentVisible(!isCommentVisible);
    fetchDiscussion(id);
  };



  useEffect(() => {
    fetchDiscussions(problemId);
  }, [problemId,fetchDiscussions]);



  return (
    <div className="space-y-6 pb-12">
  {discussions.length === 0 && (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
          <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          No discussions yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
          Be the first to start a discussion about this problem
        </p>
      </div>
    </div>
  )}

  {discussions.map((discussion) => (
    <div
      key={discussion.id}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img
              src={discussion.user.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {discussion.user.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(discussion.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {discussion.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300">
          {discussion.content}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => toggleLike(discussion.id, authUser.id)}
            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ThumbsUp size={16} />
            <span className="text-sm">{discussion.likes.length}</span>
          </button>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <MessageCircle size={16} />
            <span className="text-sm">{discussion.comments.length} comments</span>
          </div>
        </div>

        <button
          onClick={() => showComments(discussion.id)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowDown size={18} />
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={() =>
            setActiveTextboxId(
              activeTextboxId === discussion.id ? null : discussion.id
            )
          }
          className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Plus size={16} />
          Add Comment
        </button>

        {activeTextboxId === discussion.id && (
          <div className="mt-3 flex items-center gap-2">
            <input
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              type="text"
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your comment..."
            />
            <Button
              onClick={() => {
                addComment(discussion.id, comment);
                setComment("");
                setActiveTextboxId(null);
              }}
              buttonText="Post"
              Icon={Plus}
            />
          </div>
        )}
      </div>

      {isCommentVisible && (
        <div className="mt-4 space-y-4">
          {discussion.comments?.length > 0 ? (
            discussion.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="w-8 h-8 overflow-hidden rounded-full flex-shrink-0">
                  <img
                    src={comment.user.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {comment.user.name}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {comment.content}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              No comments yet
            </p>
          )}
        </div>
      )}
    </div>
  ))}

  <div className="mt-6">
    <Button
      buttonText="Start Discussion"
      Icon={Plus}
      onClick={() => setShowModal(true)}
    />
  </div>

  {showModal && (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-100">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Start a new discussion
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Content
            </label>
            <textarea
              {...register("content")}
              rows={4}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.content.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Post Discussion
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
  );
}
