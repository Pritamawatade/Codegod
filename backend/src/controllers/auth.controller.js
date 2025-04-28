import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../../generated/prisma/index.js";
import { ApiResponse } from "../utils/api-response.js";



const register = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    if (!name || !email || !password) {
     throw new ApiError(400, "Invalid data")
    }

    
    const existingUser = await db.User.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json(new ApiError(400, "User already exists").toJSON());
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    try {
      newUser = await db.User.create({
        data: {
          name,
          password: hashedPassword,
          email,
          role: UserRole.USER,
        },
      });
    } catch (error) {
      console.error("Error inserting user in DB:", error);
      return res
        .status(400)
        .json(new ApiError(400, "Error inserting user in DB").toJSON());
    }

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
        },
        "User created successfully"
      )
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error").toJSON());
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  
  try {
    if (!email || !password) {
      return res.status(400).json(new ApiError(400, "Invalid credentials"));
    }
    
    const user = await db.User.findUnique({
      where: {
        email,
      },
    });

    
    
    if (!user) {
      return res.status(400).json(new ApiError(400, "User not exist"));
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    
    
    if (!isMatch) {
      return res.status(401).json(new ApiError(401, "Wrong password"));
    }
  
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "strict",
    });
  
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
          },
        },
        "user logged in successfully"
      )
    );
  } catch (error) {
    return res
    .status(500)
    .json(new ApiError(500, "Internal Server Error"))
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt",{
      httpOnly:true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development'
    })

    res.status(200).json( new ApiResponse(200, {}, "user logged out successfully"))
    
  } catch (error) {
    return res
    .status(500)
    .json(new ApiError(500, "Internal Server Error"))
  }
};

const check = async (req, res) => {

  try {
    return  res.status(200).json(
      new ApiResponse(200,{}, "Checked system")
    )
  } catch (error) {
    return res
    .status(500)
    .json(new ApiError(500, "Internal Server Error"))
  }
};

export { register, login, logout, check };
