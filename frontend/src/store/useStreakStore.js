import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useStreakStore = create((set) => ({
    streakData: [],

    getStreakData: async () => {
        try {
            const response = await axiosInstance.get("/streak/heatmap");
            console.log(response.data.data);
            set({ streakData: response.data.data });
        } catch (error) {
            console.error("Error fetching streak stats:", error);
            toast.error("Failed to fetch streak stats");
        }
    },
}));
