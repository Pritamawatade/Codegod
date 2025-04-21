import { Router } from "express";
import { login, logout, check,   register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.get('/logout', authMiddleware, logout)
authRouter.get('/check',authMiddleware, check)

export default authRouter;