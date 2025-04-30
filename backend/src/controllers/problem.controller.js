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
        throw new ApiError(400, "Test cases are required and cannot be empty");
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
        .status(200)
        .json(new ApiResponse(201, newProblem, 'Problem created'));
    }
  } catch (error) { 
    console.error("Error in createProblem:", error);
    throw new ApiError(500, 'Something went wrong at createProblem', error);
  }
};

const getAllProblems = async (req, res) => {
  try {
    const problems = await db.Problem;
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

    res.status(200).json(new ApiResponse(200, problem, 'problem fetched'));
  } catch (error) {
    throw new ApiError(500, 'Something went wrong at getProblem controller');
  }
};

const deleteProblem = async (req, res) => {};

const updateProblem = async (req, res) => {};

const getProblemsSolvedByUser = async (req, res) => {};




export {
  createProblem,
  getAllProblems,
  getProblem,
  deleteProblem,
  updateProblem,
  getProblemsSolvedByUser,
};
