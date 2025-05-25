// in routes/streak.routes.js
import express from 'express';
import { getStreakHeatmap } from '../controllers/streak.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/heatmap', authMiddleware, getStreakHeatmap);

export default router;
