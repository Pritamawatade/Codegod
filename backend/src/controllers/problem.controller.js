import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";

const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
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

 if(req.user.role !== "ADMIN"){
    throw new ApiError(403, "Unauthorized access, ADMIN only")
 }





const getAllProblems = async (req, res) => {};

const getProblem = async (req, res) => {
    const {id} = req.params;

    try {
        const problem  = await db.problem.findUnique({
            where:{
                id
            }
        })

        if(!problem){
            throw new ApiError(404, "problem not found")
        }

        res.status(200).json(
            new ApiResponse(200,problem, "problem fetched")
        )
    } catch (error) {
        throw new ApiError(500, "Something went wrong at getProblem controller")
    }
};

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
