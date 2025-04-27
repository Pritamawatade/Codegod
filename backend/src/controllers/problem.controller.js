const createProblem = async (req, res) => {
  /* 
    id          String    @id @default(uuid())
  title       String
  description String
  difficult   Difficult
  tags        String[] // array of tags like what type of questions
  constrains  String
  userid      String
  example     Json
  hints       String
  editorial   String

  testCases         Json
  codeSnippet       Json
  referenceSolution Json

  createdAt DateTime @default(now())
  updatedAt DateTime @default(now())
    */
  const {
    title,
    description,
    defficulty,
    tags,
    constrains,
    examples,
    hints,
    editorial,
    testCases,
    codeSnippet,
    referenceSolution,
  } = req.body;
};

const getAllProblems = async (req, res) => {};

const getProblem = async (req, res) => {};

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
