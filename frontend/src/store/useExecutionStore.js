import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,
  isSubmitting: false,
  submitResult: null,
  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    try {
      console.log("entered in to execute code , source_code", source_code);
      set({ isExecuting: true });

      const res = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      

      set({ submission: res.data.data.result });


      toast.success(res.data.message);
    } catch (error) {
      console.log("Error executing code", error);
      toast.error("Error executing code");
    } finally {
      set({ isExecuting: false });
    }
  },

  //submiting code

    submitCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    try {
      console.log("entered in to execute code , source_code", source_code);
      set({ isSubmitting: true });

      const res = await axiosInstance.post("/execute-code/submit", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });

      

      set({ submitResult: res.data.data.submission });


      toast.success(res.data.message);
    } catch (error) {
      console.log("Error executing code", error);
      toast.error("Error executing code");
    } finally {
      set({ isSubmitting: false });
    }
  },
}));
