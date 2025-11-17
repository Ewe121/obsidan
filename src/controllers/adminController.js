import User from '../models/User.js';
import Publication from '../models/Publication.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPublications = await Publication.countDocuments();
    const totalDownloads = await Publication.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$downloadCount' }
        }
      }
    ]);

    const recentPublications = await Publication.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPublications,
        totalDownloads: totalDownloads[0]?.total || 0,
        recentPublications
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};