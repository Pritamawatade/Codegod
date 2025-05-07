import { all } from 'axios';
import {
  getLanguageName,
  poolBatchResult,
  submitBatch,
} from '../libs/judge0.libs.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';

export const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;

  const { ...body1 } = req.body;
  console.log('re bnody == ', body1);
  console.log('stdin lenght ===========', stdin.length);
  console.log('expected_outputs ===========', expected_outputs.length);

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

    const submission = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submitResponse = await submitBatch(submission);

    const tokens = submitResponse.map((res) => res.token);

    const result = await poolBatchResult(tokens);

    console.log(`result---------------->`, result);

    let allPassed = true;

    const detailedResult = result.map((result, i) => {
      const stdout = result.stdout.trim();
      const expected_output = expected_outputs[i];
      const passed = stdout === expected_output;

      // console.log(`for testcase ${i}`);
      // console.log(`input = ${stdin[i]}`);
      // console.log(`expected_output = ${expected_output}`);
      // console.log(`stdout = ${stdout}`);
      // console.log(`passed = ${passed}`);
      // console.log(`================================`);

      if (!passed) {
        allPassed = false;
      }

      return {
        testcase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} ms` : undefined,
        language_id: language_id,
        token: result.token,
        problemId: problemId,
      };
    });

    console.log(`detailedResult---------------->`, detailedResult);

    const submision = await db.submission.create({
      date: {
        userId,
        problemId,
        sourceCode: source_code,
        languageName: getLanguageName(language_id),
        stdin: stdin.join('\n'),
        stdout: JSON.stringify(detailedResult.map((res) => res.stdout)),
        stderr: detailedResult.some((res) => res.stderr)
          ? JSON.stringify(detailedResult.map((res) => res.stderr))
          : null,
        compileOutput: detailedResult.sme((res) => res.compile_output)
          ? JSON.stringify(detailedResult.map((res) => res.compile_output))
          : null,
        status: allPassed ? 'Accepted' : 'Wrong Answer',
        memory: detailedResult.some((res) => res.memory)
          ? JSON.stringify(detailedResult.map((res) => res.memory))
          : null,
        time: detailedResult.some((res) => res.time)
          ? JSON.stringify(detailedResult.map((res) => res.time))
          : null,
      },
    });

      if(allPassed){
        await db.problemSolved.upsert({
          where:{
            userId_problemId: {
              userId,
              problemId
            }
          },
          update:{},
          create:{
            userId,
            problemId
          }
        })
      }


      // TODO: update problemSolved vid 1:33:43



    return res.status(200).json(new ApiResponse(200, result, 'success'));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'something went wrong', error);
  }
};
