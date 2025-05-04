import express from 'express';
import { executeCode } from '../controllers/executeCode.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const executionRoute = express.Router();

executionRoute.post('/', authMiddleware, executeCode);

export default executionRoute;
