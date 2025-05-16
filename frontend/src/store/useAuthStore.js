import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";

export const useAuthStore = create((set)=>({
    authUser:null,
    isSigninUp:false,
    isLoggingIn:false,
    isCheckingAuth:false,

    checkAuth: async()=>{
        set({isCheckingAuth:true})

        try {
            const res = await axiosInstance.get('/auth/check');

            console.log(res.data);
            set({authUser:res.data, isCheckingAuth:false})
        } catch (error) {
            console.log("Error chekcing auth ",error);
            set({authUser:null, isCheckingAuth:false})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },

    login: async(data)=>{
        set({isLoggingIn:true})

        try {
            const res  = await axiosInstance.post('/auth/login',data);

            console.log(res.data);
            set({authUser:res.data, isLoggingIn:false})
            toast.success("Logged in successfully")
        } catch (error) {
            console.log("Error logging in ",error);
            toast.error("Error logging in")
        }

        finally{
            set({isLoggingIn:false})
        }
    },

    logout: async()=>{
        try {
            await axiosInstance.logout('/auth/logout');
            set({authUser:null})
            toast.success("Logged out successfully")
        } catch (error) {
            console.log("Error logging out ",error);
            toast.error("Error logging out")
        }
    }
}))
