import axios from 'axios';
import { ApiError } from '../utils/api-error.js';
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
    throw new ApiError(400, 'submissions array is empty or invalid');
  }

  console.log("submissions ---------------->",submissions);
  try {
    const { data } = await axios.post(
      `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
      {
        submissions,
      }
    );

    return data;
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'something went wrong at submitBatch', error);
  }
};

//Todo submit
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const poolBatchResult = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(','),
          base64_encoded: false,
        },
      }
    );

    const result = data.submissions;

    const isAllDone = result.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) return result;

    await sleep(1000);
  }
};
