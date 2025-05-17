import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useExecutionStore = create((set) => ({
  isExecuting: false,
  submission: null,

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

      console.log("res", res);
      console.log("res.data", res.data);
      console.log("res.data.data = ", res.data?.data);
      console.log("res.data.submission ======== = ", res.data?.submission);

      set({ submission: res.data.data.submission });

      console.log("submission ----------->>>", res.data.data.submission);

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error executing code", error);
      toast.error("Error executing code");
    } finally {
      set({ isExecuting: false });
    }
  },
}));
