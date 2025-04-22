import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { ApiError } from "../utilis/api-error.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(500)
        .json(new ApiError(500, "unautheriezed, provide the token bro"));
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json(new ApiError(401, "error in jwt verify"));
    }

    const user = await db.user.findUnique({
        where:{
            id:decoded.id
        },
        select:{
            id:true,
            name:true,
            email :true,  
            role :true,  
        }

    })

    if(!user){
        res.status(404).json(
            new ApiError(404, "User not found")
        )
    }

    req.user = user;
    next()

  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }


};

export {authMiddleware}