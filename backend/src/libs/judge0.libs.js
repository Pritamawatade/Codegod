import axios from 'axios';
import { ApiError } from '../utils/api-error.js';

// ✅ Updated Headers for Sulu API
const headers = {
  'Authorization': `Bearer ${process.env.JUDGE0_API_KEY}`, // Sulu Bearer token
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// ✅ Updated Base URL
const BASE_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.sulu.sh';

// Language Mapping
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    TypeScript: 74,
    JAVASCRIPT: 63,
    PYTHON: 71,
    JAVA: 62,
    'C++': 54,
    C: 50,
    CLOJURE: 86,
    ELIXIR: 57,
    GO: 60,
    RUBY: 72,
    RUST: 73,
    ASSEMBLY: 45,
    'C#': 51,
  };

  return languageMap[language.toUpperCase()];
};

// ✅ Submit Batch Code to Judge0 Sulu
export const submitBatch = async (submissions) => {
  if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
    throw new ApiError(400, 'Submissions array is empty or invalid');
  }

  try {
    const { data } = await axios.post(
      `${BASE_URL}/submissions/batch?base64_encoded=false`,
      { submissions },
      { headers }
    );

    return data;
  } catch (error) {
    console.error('SubmitBatch error:', error?.response?.data || error.message);
    throw new ApiError(500, 'Error submitting code to Judge0 (Sulu)', error);
  }
};

// Poll results
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const poolBatchResult = async (tokens) => {
  while (true) {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/submissions/batch`,
        {
          params: {
            tokens: tokens.join(','),
            base64_encoded: false,
          },
          headers,
        }
      );

      const result = data.submissions;

      const isAllDone = result.every(
        (r) => r.status.id !== 1 && r.status.id !== 2
      );

      if (isAllDone) return result;

      await sleep(1000);
    } catch (error) {
      console.error('Polling error:', error?.response?.data || error.message);
      throw new ApiError(500, 'Error polling submissions from Judge0 (Sulu)', error);
    }
  }
};

// Reverse Language Map
export const getLanguageName = (languageId) => {
  const languageMap = {
    74: 'TypeScript',
    63: 'Javascript',
    71: 'Python',
    62: 'Java',
    54: 'C++',
    50: 'C',
    86: 'Clojure',
    57: 'Elixir',
    60: 'Go',
    72: 'Ruby',
    73: 'Rust',
    45: 'Assembly',
    51: 'C#',
  };

  return languageMap[languageId] || 'UNKNOWN';
};
