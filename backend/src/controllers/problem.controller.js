import {
  getJudge0LanguageId,
  poolBatchResult,
  submitBatch,
} from '../libs/judge0.libs.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { db } from '../libs/db.js';
const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    constraints,
    examples,
    hints,
    editorial,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Unauthorized access, ADMIN only');
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        throw new ApiError(400, `Unsupported language: ${language}`);
      }

      if (!Array.isArray(testCases) || testCases.length === 0) {
        console.log(
          'Test cases are required and cannot be empty = ',
          testCases
        );
        throw new ApiError(400, 'Test cases are required and cannot be empty');
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token);

      const results = await poolBatchResult(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          throw new ApiError(
            400,
            `Test case failed for ${i + 1} for language ${language}`
          );
        }
      }

      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          constraints,
          examples,
          hints,
          editorial,
          testCases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      return res
        .status(201)
        .json(new ApiResponse(201, newProblem, 'Problem created'));
    }
  } catch (error) {
    console.error('Error in createProblem:', error);
    throw new ApiError(500, 'Something went wrong at createProblem', error);
  }
};

const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany({
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    if (!problems) {
      throw new ApiError(404, 'No problems found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, problems, 'Problems fetched'));
  } catch (error) {
    throw new ApiError(500, 'Something went wrong at getAllProblems', error);
  }
};

const getProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      throw new ApiError(404, 'problem not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, problem, 'problem fetched'));
  } catch (error) {
    console.log('error in getProblem', error);
    throw new ApiError(500, 'Something went wrong at getProblem controller');
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProblem = await db.problem.delete({
      where: {
        id,
      },
    });

    if (!deletedProblem) {
      throw new ApiError(404, 'problem not found');
    }

    res.status(200).json(new ApiResponse(200, '', 'problem deleted'));
  } catch (error) {
    console.log('error in deleteProblem', error);
    throw new ApiError(500, 'Something went wrong at deleteProblem');
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    constraints,
    examples,
    hints,
    editorial,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  try {
    if (!id) {
      throw new ApiError(400, 'Problem id is required');
    }

    const updatedProblem = await db.problem.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        difficulty,
        tags,
        constraints,
        examples,
        hints,
        editorial,
        testCases,
        codeSnippets,
        referenceSolutions,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProblem, 'Problem updated successfully')
      );
  } catch (error) {
    throw new ApiError(500, 'Something went wrong at updateProblem', error);
  }
};

const getProblemsSolvedByUser = async (req, res) => {
  const id = req.user.id;
  if (!id) {
    throw new ApiError(500, 'Something went wrong at getProblemsSolvedByUser');
  }
  try {
    const solvedProblems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: id,
          },
        },
      },
    });

    if (!solvedProblems) {
      throw new ApiError(404, 'No problems found');
    }

    console.log('Solved problems = ', solvedProblems);

    return res
      .status(200)
      .json(new ApiResponse(200, solvedProblems, 'Problems fetched'));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'Something went wrong at getAllProblems', error);
  }
};

const postLikeAndDislike = async (req, res) => {
  try {
    const { id: problemId } = req.params;
    const { userId, liked } = req.body;

    if (!userId || !problemId) {
      throw new ApiError(400, 'userId and problemId are required');
    }

    const feedback = await prisma.problemFeedback.upsert({
      where: {
        userId_problemId: { userId, problemId },
      },
      update: { liked, updatedAt: new Date() },
      create: { userId, problemId, liked },
    });

    if (!feedback) {
      throw new ApiError(500, 'Something went wrong at likeAndDislike');
    }

    const allFeedback = await prisma.problemFeedback.findMany({
      where: { problemId },
    });

    const likes = allFeedback.filter((f) => f.liked).length;
    const dislikes = allFeedback.length - likes;
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          feedback: feedback.liked ? true : null,
          likes,
          dislikes,
        },
        'Feedback updated successfully'
      )
    );
  } catch (error) {
    console.log('error in likeAndDislike', error);
    throw new ApiError(500, 'Something went wrong at likeAndDislike');
  }
};

const getLikeAndDislikeCount = async (req, res) => {
  try {
    const { id: problemId } = req.params;

    if (!problemId) {
      throw new ApiError(400, 'problemId is required');
    }
    const allFeedback = await prisma.problemFeedback.findMany({
      where: { problemId },
    });

    const isLiked = await prisma.problemFeedback.findFirst({
      where: { problemId, liked: true, userId: req.user.id },
    });

    const likes = allFeedback.filter((f) => f.liked).length;
    const dislikes = allFeedback.length - likes;

    if (!allFeedback) {
      throw new ApiError(500, 'Something went wrong at likeAndDislikeCount');
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          likes,
          dislikes,
          liked: isLiked !== null,
        },
        'fetched liked count'
      )
    );
  } catch (error) {
    console.log('error in likeAndDislikeCount', error);
    throw new ApiError(500, 'Something went wrong at likeAndDislikeCount');
  }
};
export {
  createProblem,
  getAllProblems,
  getProblem,
  deleteProblem,
  updateProblem,
  getProblemsSolvedByUser,
  postLikeAndDislike,
  getLikeAndDislikeCount,
};
