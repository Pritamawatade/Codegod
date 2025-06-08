import {
  getLanguageName,
  poolBatchResult,
  submitBatch,
} from '../libs/judge0.libs.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { db } from '../libs/db.js';
export const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

  try {
    const userId = req.user.id;

    if (!userId) {
      throw new ApiError(400, 'User not logged in');
    }

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      expected_outputs.length !== stdin.length
    ) {
      throw new ApiError(400, 'Invalid test cases');
    }

    const submission1 = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));


    const submitResponse = await submitBatch(submission1);

    const tokens = submitResponse.map((res) => res.token);

    const result = await poolBatchResult(tokens);


    let allPassed = true;

    const detailedResult = result.map((result, i) => {
      const stdout = result.stdout.trim();
      const expected_output = expected_outputs[i];
      const passed = stdout === expected_output;

     

      if (!passed) {
        allPassed = false;
      }

      return {
        testcase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} ms` : undefined,
        language_id: language_id,
        token: result.token,
        problemId: problemId,
      };
    });


   
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          result: detailedResult,
        },
        'code executed successfully'
      )
    );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'something went wrong', error);
  }
};
