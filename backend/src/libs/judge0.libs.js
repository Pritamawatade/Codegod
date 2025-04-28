import axios from 'axios';
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    'C++': 53,
    PHP: 68,
  };

  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submission) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submission/batch?base64_encoded=false`,
    {
      submission,
    }
  );

  return data;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const poolBatchResult = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submission/batch`,
      {
        params: {
          tokens: tokens.join(','),
          base64_encoded: false,
        },
      }
    );

    const result = data.submission;

    const isAllDone = result.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) return result;

    await sleep(1000);
  }
};
