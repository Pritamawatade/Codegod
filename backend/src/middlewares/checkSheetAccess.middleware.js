import { db } from '../libs/db.js';
import { ApiError } from '../utils/api-error.js';
import { ApiResponse } from '../utils/api-response.js';

const checkSheetAccess = async (req, res, next) => {
  const { sheetId } = req.params;
  const { id } = req.user;
  try {
    const access = await db.userPurchasedSheet.findFirst({
      where: {
        userId: id,
        sheetId,
      },
    });

    if (!access && req.user.role !== 'ADMIN') {
      return res.status(200).json(new ApiResponse(200, 'Access denied'));
    }

    next();
  } catch (err) {
    console.log(err);
    throw new ApiError(500, 'Something went wrong at checkSheetAccess');
  }
};

export default checkSheetAccess;
