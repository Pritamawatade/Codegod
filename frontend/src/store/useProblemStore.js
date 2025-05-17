import {create} from "zustand";
import {axiosInstance} from "../lib/axios";

const userProblemStore = create((set)=>({
    problems: [],
    solvedProblems:[],
    problem: null,
    isProblemLoading: false,
    isProblemsLoading: false,

    getAllProblems: async () => {
        set({isProblemsLoading: true});
        try {
            const res = await axiosInstance.get("/problems/get-all-problems");
            console.log("getAllProblems res = ",res);
            set({problems: res.data.data, isProblemsLoading: false});
        } catch (error) {
            console.log("Error getting problems", error);
            set({isProblemsLoading: false});
        }
        finally{
            set({isProblemsLoading: false});
        }
    },

}));

export default userProblemStore;