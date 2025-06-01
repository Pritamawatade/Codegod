import express from 'express';
import { executeCode } from '../controllers/executeCode.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { submission } from '../controllers/submission.controller.js';

const executionRoute = express.Router();

executionRoute.post('/', authMiddleware, executeCode);
executionRoute.post('/submit', authMiddleware, submission);

export default executionRoute;
