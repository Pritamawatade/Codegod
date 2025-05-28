import { Router } from "express"
import { addCommentToDiscussion, createDiscussion, getAllDiscussions, getDiscussionById, toggleLikeOnDiscussion } from "../controllers/discussion.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const discussionRouter = Router();

discussionRouter.post('/post/:problemId', authMiddleware, createDiscussion)
discussionRouter.get('/get-all-discussions/:problemId', authMiddleware, getAllDiscussions)
discussionRouter.get('/get-discussion/:discussionId', authMiddleware, getDiscussionById)
discussionRouter.get('/toggle-like/:discussionId', authMiddleware, toggleLikeOnDiscussion)
discussionRouter.post('/add-comment-to-discussion/:discussionId', authMiddleware, addCommentToDiscussion)


export default discussionRouter;