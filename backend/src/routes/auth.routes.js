import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/register',register)
authRouter.post('/login',login)

export default authRouter;