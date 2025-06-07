import { db } from '../libs/db.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';

const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await db.Playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, playlists, 'Playlists fetched'));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Something went wrong at getAllPlaylists', error);
  }
};

const getPlaylist = async (req, res) => {
  try {
    const {id} = req.params;
    if(!id) {
      throw new ApiError(400, 'Playlist id is required');
    }
    const playlist = await db.Playlist.findUnique({
      where: {
        id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      throw new ApiError(404, 'Playlist not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, 'Playlist fetched'));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Something went wrong at getPlaylist', error);
  }
};

const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id; 

    if(!name || !description) {
      throw new ApiError(400, 'All fields are required');
    }

    const playlist = await db.Playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });

    if (!playlist) {
      throw new ApiError(500, 'Something went wrong at createPlaylist');
    }
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, 'Playlist created'));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Something went wrong at createPlaylist', error);
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const playlist = await db.Playlist.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    if (!playlist) {
      throw new ApiError(404, 'Playlist not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, 'Playlist updated'));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Something went wrong at updatePlaylist', error);
  }
};

const addProblemToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemId } = req.body;

    if (!playlistId) {
      throw new ApiError(400, 'playlistId is required');
    }

    if (!problemId) {
      throw new ApiError(400, 'problemId is required');
    }

    if (!Array.isArray(problemId) || problemId.length === 0) {
      throw new ApiError(400, 'problemId array is empty or invalid');
    }

    // create records for each problem

    const ProblemInPlaylist = await db.ProblemInPlaylist.createMany({
      data: problemId.map((id) => ({
        playlistId,
        problemId: id,
      }))
    });

    if (!ProblemInPlaylist) {
      throw new ApiError(500, 'Something went wrong at addProblemToPlaylist');
    }

    res
      .status(201)
      .json(
        new ApiResponse(201, ProblemInPlaylist, 'Problem added to playlist')
      );
  } catch (error) {
    console.log("error in addProblem playlist ", error)
    throw new ApiError(
      500,
      'Something went wrong at addProblemToPlaylist',
      error
    );
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const id = req.params.id;

    const playlist = await db.Playlist.delete({
      where: {
        id,
      },
    });

    if (!playlist) {
      throw new ApiError(404, 'Playlist not found');
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "", 'Playlist deleted'));
  } catch (error) {
    console.log("error in delete playlist ", error)
    throw new ApiError(500, 'Something went wrong at deletePlaylist', error);
  }
};
const removeProblemFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!playlistId) {
      throw new ApiError(400, 'playlistId is required');
    }

    if (!problemIds || !Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ApiError(400, 'problemIds array is empty or invalid');
    }
    
    const removedProblemFromPlaylist = await db.ProblemInPlaylist.deleteMany({
      where: {
        playlistId: playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    if (!removedProblemFromPlaylist) {
      throw new ApiError(404, 'Playlist not found');
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          removedProblemFromPlaylist,
          'Problem removed from playlist'
        )
      );
  } catch (error) {
    console.error("error at removeProblemFromPlaylist--->",error);
    throw new ApiError(
      500,
      'Something went wrong at removeProblemFromPlaylist',
      error
    );
  }
};

const isProblemInPlaylist = async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
}

export {
  addProblemToPlaylist,
  getAllPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  removeProblemFromPlaylist,
};
