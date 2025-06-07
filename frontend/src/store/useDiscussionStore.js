import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useDiscussionStore = create((set, get) => ({
  discussions: [],
  discussion: [],

  fetchDiscussions: async (problemId) => {
    try {
      const res = await axiosInstance.get(`/discussion/get-all-discussions/${problemId}`);
      set({ discussions: res.data.data });
    } catch (err) {
      console.error('Failed to fetch discussions:', err);
    }
  },

  fetchDiscussion: async (discussionId) => {
    try {
      const res = await axiosInstance.get(`/discussion/get-discussion/${discussionId}`);
      console.log(res.data.data);
      set({ discussion: res.data.data });
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  },
  toggleLike: async (discussionId, userId) => {
    try {
      await axiosInstance.get(`/discussion/toggle-like/${discussionId}`);
      const updated = get().discussions.map((d) => {
        if (d.id === discussionId) {
          const liked = d.likes.some((l) => l.userId === userId);
          return {
            ...d,
            likes: liked
              ? d.likes.filter((l) => l.userId !== userId)
              : [...d.likes, { userId: userId }],
          };
        }
        return d;
      });
      set({ discussions: updated });
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  },

  addCommentToDiscussion: async(discussionId, content)=>{
    try {
      axiosInstance.post(`/discussion/add-comment-to-discussion/${discussionId}`, content);

    } catch (error) {
      console.log("error in adding comment", error)
    }
  },

  addDiscussion: async(problemId, data) => {
    try {
      axiosInstance.post(`/discussion/post/${problemId}`, data);
    } catch (error) {
      console.log("error in adding discussion", error)
    }
  }


}));
