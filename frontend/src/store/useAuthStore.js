import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

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
    }

     
}))
