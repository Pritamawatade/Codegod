import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

export const useDiscussionStore = create((set, get) => ({
  discussions: [],

  fetchDiscussions: async (problemId) => {
    try {
      const res = await axiosInstance.get(`/discussion/get-all-discussions/${problemId}`);
      set({ discussions: res.data.data });
    } catch (err) {
      console.error('Failed to fetch discussions:', err);
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
}));
