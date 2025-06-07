import { Router } from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";
import { addProblemToSheet, createSheet, deleteSheet, getAllSheets, getProgress, getSheet, getSheetProblems, updateSheet } from "../controllers/sheet.controller.js";
import checkSheetAccess from "../middlewares/checkSheetAccess.middleware.js";

const sheetRouter = Router();

sheetRouter.post('/create', authMiddleware, checkAdmin, createSheet)
sheetRouter.put("/:sheetId/add-problem/:problemId", authMiddleware, checkAdmin, addProblemToSheet);
sheetRouter.get("/:sheetId/problems", authMiddleware, checkSheetAccess, getSheetProblems);
sheetRouter.get("/:sheetId", authMiddleware, checkSheetAccess, getSheet);
sheetRouter.delete("/:sheetId", authMiddleware, checkAdmin, deleteSheet)
sheetRouter.put("/:sheetId", authMiddleware, checkAdmin, updateSheet);
sheetRouter.get("/:sheetId/progress", authMiddleware, checkSheetAccess, getProgress);
sheetRouter.get("/", authMiddleware, getAllSheets);

export default sheetRouter;