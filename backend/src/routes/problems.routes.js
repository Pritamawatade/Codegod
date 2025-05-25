import { Router } from 'express';
import { authMiddleware, checkAdmin } from '../middlewares/auth.middleware.js';
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblem,
  getProblemsSolvedByUser,
  likeAndDislike,
  likeAndDislikeCount,
  updateProblem,
} from '../controllers/problem.controller.js';

const problemRouter = Router();

problemRouter.post(
  '/create-problem',
  authMiddleware,
  checkAdmin,
  createProblem
);
problemRouter.get(
  '/get-all-problems',
  authMiddleware,
  getAllProblems
);
problemRouter.get('/get-problem/:id', authMiddleware, getProblem);

problemRouter.delete(
  '/delete-problem/:id',
  authMiddleware,
  checkAdmin,
  deleteProblem
);
problemRouter.put(
  '/update-problem/:id',
  authMiddleware,
  checkAdmin,
  updateProblem
);
problemRouter.get(
  '/get-solved-problems',
  authMiddleware,
  getProblemsSolvedByUser
);

problemRouter.post('/:id/feedback', authMiddleware, likeAndDislike);
problemRouter.get('/:id/feedback-count', authMiddleware, likeAndDislikeCount);

export default problemRouter;
