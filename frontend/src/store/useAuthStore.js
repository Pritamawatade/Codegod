import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isUpdating: false,
  isCheckingAuth: false,
  isUpdatingPassword: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get("/users/check");

      set({ authUser: res?.data?.data, isCheckingAuth: false });
    } catch (error) {
      console.log("Error chekcing auth ", error);
      set({ authUser: null, isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/users/register", data);

      set({ authUser: res?.data?.data?.user, isSigninUp: false });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/users/login", data);

      console.log("line 48 res = ", res);
      console.log("res.data on login 49",res?.data?.data);
      console.log("res.data on login 45",res?.data?.data?.user);

      set({ authUser: res?.data?.data?.user, isLoggingIn: false });
      toast.success("Logged in successfully");
    } catch (error) {
      console.log("Error logging in ", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

   updateProfile: async (data) => {
    set({ isUpdating: true });

    try {
      const res = await axiosInstance.post("/users/update-account-details", data);

      console.log("line 48 res = ", res);
      console.log("res.data on login 49",res?.data?.data);
      console.log("res.data on login 45",res?.data?.data?.user);

      set({ authUser: res?.data?.data?.user, isUpdating: false });
      toast.success("profile updated successfully");
    } catch (error) {
      console.log("Error updating profile", error);
      toast.error("Error updating profile");
    } finally {
      set({ isUpdating: false });
    }
  },

  updatePassword: async (data)=>{
    set({ isUpdatingPassword: true });

    try {
      const res = await axiosInstance.post("/users/change-password", data);

      set({ authUser: res?.data?.data?.user, isUpdatingPassword: false });
      toast.success("Password updated successfully");
    } catch (error) {
      console.log("Error updating password", error);
      toast.error("Error updating password");
    } finally {
      set({ isUpdatingPassword: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/users/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Error logging out ", error);
      toast.error("Error logging out");
    }
  },
}));
