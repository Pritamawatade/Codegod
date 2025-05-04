import { poolBatchResult, submitBatch } from '../libs/judge0.libs.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';

export const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

    const { ...body1 } = req.body;
    console.log("re bnody == ", body1);
    console.log("stdin lenght ===========",stdin.length);
    console.log("expected_outputs ===========",expected_outputs.length);

    
    
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
      (input) => ({
        source_code,
        language_id,
        stdin: input,
      })
    );

    const submitResponse = await submitBatch(submission) 

    const tokens = submitResponse.map((res)=>res.token)
 
    const result = await poolBatchResult(tokens)

    console.log(`result---------------->`,result);

    let allPassed = true;
    
    return res.status(200).json(new ApiResponse(200, result, 'success'));
    
    
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'something went wrong', error);
  }
};
