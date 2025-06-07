import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';

import { db } from '../libs/db.js';

const createSheet = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const sheet = await db.dsaSheet.create({
      data: {
        title,
        description,
        price,
      },
    });

    return res.status(201).json(new ApiResponse(201, sheet, 'Sheet created'));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, 'internal server error');
  }
};

const addProblemToSheet = async (req, res) => {
  const { problemId, sheetId } = req.params;
  try {
    const problem = await db.problem.update({
      where: { id: problemId },
      data: { sheetId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, problem, 'problem added to sheet'));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'internal server error');
  }
};

const getSheetProblems = async (req, res) => {
  const { sheetId } = req.params;

  try {
    const problems = await db.problem.findMany({
      where: { sheetId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, problems, 'problems fetched'));
  } catch (err) {
    console.log(err);
    throw new ApiError(500, 'internal server error');
  }
};

const getSheet = async (req, res) => {
  try {
    const { sheetId } = req.params;

    if (!sheetId) {
      throw new ApiError(400, 'sheetId is required');
    }
    const sheet = await db.dsaSheet.findUnique({
      where: {
        id: sheetId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        problems: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            tags: true
          },
          orderBy: {
            id: 'asc',
          },
        },
        _count: {
          select: {
            problems: true,
          },
        },
      },
    });

    if (!sheet) {
      throw new ApiError(404, 'sheet not found');
    }

    return res.status(200).json(new ApiResponse(200, sheet, 'Sheet fetched'));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'internal server error at getting sheet');
  }
};

const deleteSheet = async (req, res) => {
  try {
    const { sheetId } = req.params;

    if (!sheetId) {
      throw new ApiError(400, 'sheetId is required');
    }

    const sheet = await db.dsaSheet.delete({
      where: {
        id: sheetId,
      },
    });

    return res.status(200).json(new ApiResponse(200, sheet, 'Sheet deleted'));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'internal server error at deleting sheet');
  }
};

const updateSheet = async (req, res) => {
  try {
    const { sheetId } = req.params;
    const { title, description, price } = req.body;

    if (!sheetId) {
      throw new ApiError(400, 'sheetId is required');
    }

    const sheet = await db.dsaSheet.update({
      where: {
        id: sheetId,
      },
      data: {
        title,
        description,
        price,
      },
    });

    return res.status(200).json(new ApiResponse(200, sheet, 'Sheet updated'));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'internal server error at updating sheet');
  }
};

const getProgress = async (req, res) => {
  const { id: userId } = req.user;
  const { sheetId } = req.params;

  try {
    const total = await prisma.problem.count({
      where: { sheetId },
    });

    const completed = await prisma.userProgress.count({
      where: {
        userId,
        problem: { sheetId },
      },
    });


    return res.status(200).json(
      new ApiResponse(
        200,
        {
          total,
          completed,
          percentage: Math.round((completed / total) * 100),
        },
        'Sheet fetched'
      )
    );
  } catch (err) {
    console.log(err);
    throw new ApiError(
      500,
      'internal server error a get progress',
      err.message
    );
  }
};

const getAllSheets = async (req, res) => {
  try {
    const sheets = await db.dsaSheet.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        _count: {
          select: {
            problems: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, sheets, 'All sheets fetched'));
  } catch (error) {
    console.log(error);
    throw new ApiError(500, 'internal server error at getting all sheets');
  }
};



export {
  createSheet,
  addProblemToSheet,
  getSheetProblems,
  getSheet,
  deleteSheet,
  updateSheet,
  getProgress,
  getAllSheets,
};
