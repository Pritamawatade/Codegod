import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
const userProblemStore = create((set) => ({
  problems: [],
  solvedProblems: [],
  problem: null,
  isProblemLoading: false,
  isProblemsLoading: false,

  getAllProblems: async () => {
    set({ isProblemsLoading: true });
    try {
      const res = await axiosInstance.get("/problems/get-all-problems");
      console.log("getAllProblems res = ", res);
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
      console.log("getProblemById res = ", res);

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
      console.log("getSolvedProblemByUser res = ", res);

      set({ solvedProblems: res.data.data });
    } catch (error) {
      console.log("Error getting problem", error);
      toast.error("Error in getting problem");
    }
  }
}));

export default userProblemStore;
