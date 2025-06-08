import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set) => ({
  isLoading: false,
  submissions: [],
  submissionForProblem: null,
  submissionCount: null,
  allSubmissions: null,

  getAllSubmissions: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/submission/get-all-submissions");

      set({ submissions: res.data.data });
    } catch (error) {
      console.log("Error getting all submissions", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-sumbmission-for-problem/${problemId}`
      );

      set({ submissionForProblem: res.data.data });
    } catch (error) {
      console.log("Error getting submissions for problem", error);

      toast.error("Error getting submissions for problem");
    } finally {
      set({ isLoading: false });
    }
  },

  getSubmissionCountForProblem: async (problemId) => {
    try {
      const res = await axiosInstance.get(
        `/submission/get-submission-count/${problemId}`
      );

      set({ submissionCount: res.data.data });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },

  getAllSubmissionsForAdmin: async () => {
    try {
      const res = await axiosInstance.get('/submission/get-submissions');
      console.log(res.data.data)
      set({ allSubmissions: res.data.data });
    } catch (error) {
      console.log("Error getting submission count for problem", error);
      toast.error("Error getting submission count for problem");
    }
  },
}));
