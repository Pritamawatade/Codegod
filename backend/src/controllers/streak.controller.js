import { db } from '../libs/db.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';

export const getStreakHeatmap = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    // Get all streak entries
    const streaks = await db.dailyStreak.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    // Format them like GitHub-style graph: [{ date, count }]
    const result = streaks.map((streak) => ({
      date: streak.date.toISOString().split('T')[0], // "YYYY-MM-DD"
      count: streak.count
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Streak heatmap data'));
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, 'Something went wrong'));
  }
};
