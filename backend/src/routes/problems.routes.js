import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblem,
  getProblemsSolvedByUser,
  updateProblem,
} from "../controllers/problem.controller.js";

const problemRouter = express.Router();

problemRouter.post("/create", authMiddleware, checkAdmin, createProblem);
problemRouter.get("/get-all-problems", authMiddleware, getAllProblems);
problemRouter.get("/get-problem/:id", authMiddleware, getProblem);
problemRouter.delete("/delete-problem/:id", authMiddleware, checkAdmin, deleteProblem);
problemRouter.put("/update-problem/:id", authMiddleware, checkAdmin, updateProblem);
problemRouter.get('/get-solved-problems', authMiddleware, getProblemsSolvedByUser)

export default problemRouter;
