import jwt from 'jsonwebtoken';
import { db } from '../libs/db.js';
import { ApiError } from '../utils/api-error.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new ApiError(500, 'unauthorized, provide the token bro');
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, 'error in jwt verify');
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);

    throw new ApiError(500, 'Error in authMiddleware', error);
  }
};

const checkAdmin = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await db.User.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ApiError(403, 'unauthorized access, ADMIN only');
    }

    next();
  } catch (error) {
    console.log(error);

    throw new ApiError(500, 'Something went wrong at CheckAdmin', error);
  }
};

export { authMiddleware, checkAdmin };
