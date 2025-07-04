import {
  getLanguageName,
  poolBatchResult,
  submitBatch,
} from '../libs/judge0.libs.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';
import { db } from '../libs/db.js';
export const submission = async (req, res) => {
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


    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join('\n'),
        stdout: JSON.stringify(detailedResult.map((res) => res.stdout)),
        stderr: detailedResult.some((res) => res.stderr)
          ? JSON.stringify(detailedResult.map((res) => res.stderr))
          : null,
        compileOutput: detailedResult.some((res) => res.compile_output)
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


    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize date to remove time

      await db.dailyStreak.upsert({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
        update: {
          count: { increment: 1 },
        },
        create: {
          userId,
          date: today,
        },
      });
    }

    const testCaseResults = detailedResult.map((result) => ({
      submissionId: submission.id,
      testCase: result.testcase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr || null,
      compileOutput: result.compile_output || null,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));


    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissonWithTestCases = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testcaseresult: true,
      },
    });

    console.log(
      'submission with testcases------------->',
      submissonWithTestCases
    );

    const problem = await db.problem.findFirst({
      where: {
        id: problemId,
      },
    });

    if (problem.sheetId) {
      try {
        const alreadyExists = await db.userProgress.findFirst({
          where: {
            userId,
            problemId,
          },
        });

        if (!alreadyExists) {
          await db.userProgress.create({
            data: {
              userId,
              problemId,
            },
          });
        }
      } catch (error) {
        console.error('User progress insert failed:', error);
      }
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          submission: submissonWithTestCases,
        },
        'code executed successfully'
      )
    );
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'something went wrong', error);
  }
};
