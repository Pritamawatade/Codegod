import { db } from '../libs/db.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';

const getAllSubmissions = async (req, res) => {
  const userID = req.user.id;
  try {
    const submissions = await db.submission.findMany({
      where: {
        userId: userID,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, submissions, 'Submissions fetched'));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'Something went wrong at getAllSubmissions', error);
  }
};
const getSubmissionForProblem = async (req, res) => {
  const { problemId: id } = req.params;
  const userID = req.user.id;

  try {
    const submissions = await db.submission.findMany({
      where: {
        problemId: id,
        userId: userID,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, submissions, 'Submissions fetched'));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      'Something went wrong at getSubmissionForProblem',
      error
    );
  }
};
const getSubmissionCountForProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const submissionCount = await db.submission.count({
      where: {
        problemId: id,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, submissionCount, 'Submissions fetched'));
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      'Something went wrong at getSubmissionCountForProblem',
      error
    );
  }
};
const getAllSubmissionsForAllProblems = async (req, res) => {
  try {
    const submissions = await db.submission.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        Problem: {
          select: {
            title: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          submissions,
          'Submissions for all users and problems fetched'
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      'Something went wrong at getAllSubmissionsForAllProblems',
      error
    );
  }
};
export {
  getAllSubmissions,
  getSubmissionForProblem,
  getSubmissionCountForProblem,
  getAllSubmissionsForAllProblems,
};
