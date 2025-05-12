import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getAllSubmissions, getSubmissionCountForProblem, getSubmissionForProblem } from '../controllers/submisson.contoller.js';
const submissionRoute = express.Router();

submissionRoute.get('/get-all-submissions', authMiddleware, getAllSubmissions);
submissionRoute.get('/get-sumbmission-for-problem/:problemId', authMiddleware, getSubmissionForProblem);
submissionRoute.get('/get-submission-count/:problemId', authMiddleware, getSubmissionCountForProblem);

export default submissionRoute;