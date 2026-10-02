import axios from 'axios';
import { ApiError } from '../utils/api-error.js';
import { Buffer } from 'buffer';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Local Judge0 does not require auth. Keep hosted Judge0 compatibility.
  if (process.env.JUDGE0_API_KEY) {
    headers.Authorization = `Bearer ${process.env.JUDGE0_API_KEY}`;
  }

  return headers;
};

const BASE_URL = process.env.JUDGE0_API_URL || 'http://localhost:2358';

/** Judge0 stdin is fed as raw bytes many clients omit a trailing LF; Node readline often needs it. */
export const normalizeJudge0Stdin = (stdin) => {
  if (stdin === null || stdin === undefined) return '';
  const s = String(stdin);
  if (s.length === 0) return '';
  return s.endsWith('\n') ? s : `${s}\n`;
};

const encode = (str) => {
  if (str === null || str === undefined) return null;
  return Buffer.from(String(str)).toString('base64');
};

const decode = (base64) => {
  if (base64 === null || base64 === undefined) return null;
  return Buffer.from(base64, 'base64').toString('utf8');
};

/**
 * Compare admin "expected output" with Judge0 stdout.
 * - Normalizes CRLF → LF
 * - Strips **trailing** whitespace only (trimEnd) so a single trailing `\n` from
 *   `console.log` does not break equality when the form expected is `8` not `8\n`.
 * - Does **not** trim leading spaces (not full `.trim()`).
 */
// Normalize Judge0 stdout/expected for comparison.
// More permissive than before: normalizes CRLF→LF, collapses whitespace,
// trims both ends, and prepares for numeric/boolean/JSON tolerant compares.
export const normalizeJudgeStdoutForCompare = (s) => {
  let str = String(s ?? '');
  // Normalize newlines
  str = str.replace(/\r\n/g, '\n');
  // Trim both ends to be more permissive about surrounding whitespace/newlines
  str = str.trim();
  // Collapse multiple whitespace characters (spaces, tabs, newlines) into single space
  // This makes differences in spacing or line breaks less likely to break equality
  str = str.replace(/\s+/g, ' ');
  return str;
};

const tryParseNumber = (s) => {
  if (s === null || s === undefined) return null;
  const t = String(s).trim();
  if (t.length === 0) return null;
  // Accept integers and floats
  if (/^-?\d+(?:\.\d+)?$/.test(t)) return Number(t);
  return null;
};

const tryParseBoolean = (s) => {
  if (s === null || s === undefined) return null;
  const t = String(s).trim().toLowerCase();
  if (t === 'true') return true;
  if (t === 'false') return false;
  return null;
};

const tryParseJSON = (s) => {
  try {
    return JSON.parse(s);
  } catch (_e) {
    return null;
  }
};

const deepEqual = (a, b) => {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (e) {
    return false;
  }
};

export const judgeStdoutMatchesExpected = (expected, actual) => {
  const nexp = normalizeJudgeStdoutForCompare(expected);
  const nact = normalizeJudgeStdoutForCompare(actual);

  if (nexp === nact) return true;

  // Numeric comparison (allow numeric strings vs numbers)
  const nExpNum = tryParseNumber(nexp);
  const nActNum = tryParseNumber(nact);
  if (nExpNum !== null && nActNum !== null) {
    // For floats, allow tiny epsilon
    if (!Number.isFinite(nExpNum) || !Number.isFinite(nActNum)) return false;
    if (Math.abs(nExpNum - nActNum) < 1e-9) return true;
    return false;
  }

  // Boolean comparison
  const nExpBool = tryParseBoolean(nexp);
  const nActBool = tryParseBoolean(nact);
  if (nExpBool !== null && nActBool !== null) return nExpBool === nActBool;

  // Try JSON parse and deep compare (useful for arrays/objects where spacing differs)
  const pExp = tryParseJSON(expected ?? '');
  const pAct = tryParseJSON(actual ?? '');
  if (pExp !== null && pAct !== null) {
    return deepEqual(pExp, pAct);
  }

  return false;
};

// Language Mapping
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    TYPESCRIPT: 74,
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

/**
 * Single submission with wait=true — avoids batch endpoint "Internal Error" on some Judge0 CE setups.
 * Returns the full submission object (status, stdout, stderr, …).
 */
export const submitJudge0SingleWait = async ({
  source_code,
  language_id,
  stdin,
}) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/submissions?base64_encoded=true&wait=true`,
      {
        source_code: encode(source_code),
        language_id,
        stdin: encode(normalizeJudge0Stdin(stdin)),
      },
      {
        headers: getHeaders(),
        timeout: 120_000,
      }
    );

    // Decode base64 responses
    if (data.stdout) data.stdout = decode(data.stdout);
    if (data.stderr) data.stderr = decode(data.stderr);
    if (data.compile_output) data.compile_output = decode(data.compile_output);
    if (data.message) data.message = decode(data.message);

    return data;
  } catch (error) {
    console.error(
      'submitJudge0SingleWait error:',
      error?.response?.data || error.message
    );
    throw new ApiError(500, 'Error submitting code to Judge0', error);
  }
};

export const submitBatch = async (submissions) => {
  if (!submissions || !Array.isArray(submissions) || submissions.length === 0) {
    throw new ApiError(400, 'Submissions array is empty or invalid');
  }

  try {
    const encodedSubmissions = submissions.map((s) => ({
      ...s,
      source_code: encode(s.source_code),
      stdin: encode(normalizeJudge0Stdin(s.stdin)),
    }));

    const { data } = await axios.post(
      `${BASE_URL}/submissions/batch?base64_encoded=true`,
      { submissions: encodedSubmissions },
      { headers: getHeaders() }
    );

    return data;
  } catch (error) {
    console.error('SubmitBatch error:', error?.response?.data || error.message);
    throw new ApiError(500, 'Error submitting code to Judge0', error);
  }
};

// Poll results
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const poolBatchResult = async (tokens) => {
  while (true) {
    try {
      const { data } = await axios.get(`${BASE_URL}/submissions/batch`, {
        params: {
          tokens: tokens.join(','),
          base64_encoded: true,
        },
        headers: getHeaders(),
      });

      const result = data.submissions;

      const isAllDone = result.every(
        (r) => r.status.id !== 1 && r.status.id !== 2
      );

      if (isAllDone) {
        // Decode results
        result.forEach((r) => {
          if (r.stdout) r.stdout = decode(r.stdout);
          if (r.stderr) r.stderr = decode(r.stderr);
          if (r.compile_output) r.compile_output = decode(r.compile_output);
          if (r.message) r.message = decode(r.message);
        });
        return result;
      }

      await sleep(1000);
    } catch (error) {
      console.error('Polling error:', error?.response?.data || error.message);
      throw new ApiError(500, 'Error polling submissions from Judge0', error);
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
