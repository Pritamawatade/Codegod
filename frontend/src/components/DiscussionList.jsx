import { use, useEffect } from "react";
import { useDiscussionStore } from "../store/useDiscussionStore";
import {
  ArrowDown,
  MessageCircle,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function DiscussionList({ problemId }) {
  const { authUser } = useAuthStore();
  const {
    discussions,
    discussion:disc,
    fetchDiscussion,
    fetchDiscussions,
    toggleLike,
  } = useDiscussionStore();

  useEffect(() => {
    fetchDiscussions(problemId);
  }, [problemId, fetchDiscussions]);

  return (
    <div className="space-y-4">
      {discussions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500 text-center" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No discussions yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Be the first to start a discussion about this problem
            </p>
          </div>
        </div>
      )}
      {discussions.map((discussion) => (
        <div
          key={discussion.id}
          className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {discussion.user.name}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(discussion.createdAt).toLocaleDateString()}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {discussion.title}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            {discussion.content}
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <button
              onClick={() => toggleLike(discussion.id, authUser.id)}
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ThumbsUp size={16} /> {discussion.likes.length}
            </button>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <MessageCircle size={16} /> {discussion.comments.length} comments
            </div>

            <button
              onClick={() => fetchDiscussion(discussion.id)}
              className="flex items-end justify-end p-2 text-gray-500 dark:text-gray-400 
            "
            >
              <ArrowDown />
            </button>
          </div>

          {disc.comments?.length > 0
            ? disc.comments.map((comment) => (
                <div className="mt-4  flex items-center justify-start p" key={comment.id}>
                  <div className="imgCover w-12 h-12 p-2 rounded-full">
                    {console.log(comment)}
                    <img src={comment.user?.image || "https://cdn-icons-png.flaticon.com/128/10412/10412528.png"} alt="" />
                  </div>

                  <div className="text-sm">{comment.content}</div>
                </div>
              ))
            : ""}
        </div>
      ))}
    </div>
  );
}
