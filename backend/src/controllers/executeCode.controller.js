import { ApiError } from '../utils/api-error';
import { ApiResponse } from '../utils/api-response';

export const executeCode = async (req, res) => {
  const { source_code, language_code, stdin, expected_outputs, problemId } =
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

    const submission = stdin.map(
      (input = {
        source_code,
        language_code,
        stdin: input,
      })
    );

    const submitResponse = await submitBatch() 
  } catch (error) {
    throw new ApiError(500, 'something went wrong');
  }
};
