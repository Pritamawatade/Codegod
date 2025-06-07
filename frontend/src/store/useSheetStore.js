import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const useSheetStore = create((set, get) => ({
  sheets: [],
  sheet: null,
  sheetProblems: [],
  progress: null,
  loading: false,
  error: null,

  // Get all sheets
  getAllSheets: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/sheets");
      set({ sheets: res.data.data, loading: false });
      return res.data.data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },


  // Create a new sheet (admin only)
  createSheet: async (sheetData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/sheets/create", sheetData);
      set((state) => ({
        sheets: [...state.sheets, res.data.data],
        loading: false,
      }));
      return res.data.data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  // Add a problem to a sheet (admin only)
  addProblemToSheet: async (sheetId, problemId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/sheets/${sheetId}/add-problem/${problemId}`);
      set({ loading: false });
      return res.data.data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  // Get all problems in a sheet
  getSheetProblems: async (sheetId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/sheets/${sheetId}/problems`);
      set({ sheetProblems: res.data.data, loading: false });
      return res.data.data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  // Get a single sheet's details
  getSheet: async (sheetId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/sheets/${sheetId}`);
      set({ sheet: res.data.data, loading: false });
      return res.data.data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  // Delete a sheet (admin only)
  deleteSheet: async (sheetId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.delete(`/sheets/${sheetId}`);
      set((state) => ({
        sheets: state.sheets.filter((s) => s.id !== sheetId),
        loading: false,
      }));
      return res.data.data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  // Update a sheet (admin only)
  updateSheet: async (sheetId, updateData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(`/sheets/${sheetId}`, updateData);
      set({ sheet: res.data.data, loading: false });
      return res.data.data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },

  // Get progress for a sheet
  getProgress: async (sheetId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/sheets/${sheetId}/progress`);
      set({ progress: res.data.data, loading: false });
      return res.data.data;
    } catch (error) {
      set({ error, loading: false });
      throw error;
    }
  },
}));

export default useSheetStore;