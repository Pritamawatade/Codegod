import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
const useProblemStore = create((set) => ({
  problems: [],
  solvedProblems: [],
  problem: null,
  isProblemLoading: false,
  isProblemsLoading: false,
  liked: null,
  likes: null,
  dislikes: null,

  getAllProblems: async () => {
    set({ isProblemsLoading: true });
    try {
      const res = await axiosInstance.get("/problems/get-all-problems");
      set({ problems: res.data.data, isProblemsLoading: false });
    } catch (error) {
      console.log("Error getting problems", error);
      set({ isProblemsLoading: false });
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    set({ isProblemLoading: true });
    try {
      const res = await axiosInstance.get(`/problems/get-problem/${id}`);

      set({ problem: res.data.data, isProblemLoading: false });
    } catch (error) {
      console.log("Error getting problem", error);
      set({ isProblemLoading: false });
      toast.error("Error in getting problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");

      set({ solvedProblems: res.data.data });
    } catch (error) {
      console.log("Error getting problem", error);
      toast.error("Error in getting problem");
    }
  },

  getLikesAndDislikes: async (id) => {
    try {
      const res = await axiosInstance.get(`/problems/${id}/feedback-count`);

      set({
        likes: res.data.data.likes,
        dislikes: res.data.data.dislikes,
        liked: res.data.data.liked,
      });
    } catch (error) {
      console.log("Error getting problem like count", error);
    }
  },

  postLikeAndDislike: async (id, data) => {
    console.log(id, data);
    try {
      const res = await axiosInstance.post(`/problems/${id}/feedback`, data);
      set({
        likes: res.data.data.likes,
        dislikes: res.data.data.dislikes,
        liked: res.data.data.liked,
      });
    } catch (error) {
      console.log("Error getting problem", error);
      toast.error("Error in getting problem");
    }
  },
}));

export default useProblemStore;
