import { db } from '../libs/db.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';

const createDiscussion = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { problemId } = req.params;

    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      throw new ApiError(404, 'problem not found');
    }

    if (!title || !content) {
      throw new ApiError(400, 'All fields are required');
    }

    const discussion = await db.discussion.create({
      data: {
        title,
        content,
        problemId,
        userId: req.user.id,
      },
    });

    if (!discussion) {
      throw new ApiError(400, 'discussion not created');
    }

    return res
      .status(201)
      .json(new ApiResponse(201, discussion, 'discussion created'));
  } catch (error) {
    console.log('Error in discussion creation ', error);
    throw new ApiError(500, 'error in create discussion', error);
  }
};

const getAllDiscussions = async (req, res) => {
  try {
    const { problemId } = req.params;

    const allDiscussions = await db.discussion.findMany({
      where: {
        problemId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                id: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
      },
    });

    res
      .status(200)
      .json(new ApiResponse(200, allDiscussions, 'All discussions fetched'));
  } catch (error) {
    console.log('error in get all discussion', error);
    throw new ApiError(500, 'Error in getting discussion', error);
  }
};

const getDiscussionById = async (req, res) => {
  try {
    const { discussionId } = req.params;

    if (!discussionId) {
      throw new ApiError(400, 'discussionId is required');
    }

    const discussion = await db.discussion.findUnique({
      where: {
        id: discussionId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
                id: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
      },
    });

    if (!discussion) {
      throw new ApiError(404, 'discussion not found');
    }

    res
      .status(200)
      .json(new ApiResponse(200, discussion, 'discussion fetched'));
  } catch (error) {
    console.log('error in get discussion by id', error);
    throw new ApiError(500, 'Error in getting discussion by id', error);
  }
};

const toggleLikeOnDiscussion = async (req, res, next) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user.id;

    const existingLike = await db.like.findUnique({
      where: {
        userId_discussionId: { userId, discussionId },
      },
    });

    if (existingLike) {
      // Unlike
      await db.like.delete({
        where: {
          userId_discussionId: { userId, discussionId },
        },
      });
      return res
        .status(200)
        .json(new ApiResponse(200, null, 'Unliked discussion'));
    } else {
      // Like
      await db.like.create({
        data: {
          userId,
          discussionId,
        },
      });
      return res
        .status(200)
        .json(new ApiResponse(200, null, 'Liked discussion'));
    }
  } catch (error) {
    console.log('Error in toggleLikeOnDiscussion', error);
    next(new ApiError(500, 'Error toggling like', error));
  }
};

const addCommentToDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;

    const discussion = await db.discussion.findUnique({
      where: {
        id: discussionId,
      },
    });

    if (!discussion) {
      throw new ApiError(400, 'No discussion found');
    }

    const comment = await db.comment.create({
      data: {
        content,
        userId: req.user.id,
        discussionId,
      },
    });

    if (!comment) {
      throw new ApiError(400, 'comment not created');
    }

    res.status(201).json(new ApiResponse(201, comment, 'comment posted'));
  } catch (error) {
    console.log('error in add comments to discussion', error);
    throw new ApiError(500, 'Error in adding comment', error);
  }
};

export {
  createDiscussion,
  getAllDiscussions,
  getDiscussionById,
  addCommentToDiscussion,
  toggleLikeOnDiscussion,
};
