import {ApiError} from "../utilis/api-error.js"

const register = async(req,res,next)=>{
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return ApiError(400,"Invalid Creaditials")
        }

        
    } catch (error) {
        console.log(error)
        return ApiError(400,"Invalid Creaditials")
    }
}

export {register}