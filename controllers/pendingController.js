const { Sequelize, Op } = require('sequelize');
const User = require('../models/User');

exports.getUserCountForGraph = async (req, res) => {
  try {
    // Log message to track the start of the function
    console.log("Fetching user counts for graph...");

    const userCounts = await User.findAll({
      attributes: [
        [Sequelize.fn('TO_CHAR', Sequelize.col('createdAt'), 'YYYY-MM'), 'month'], // Group by month in 'YYYY-MM' format
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'], // Count users
      ],
      where: {
        status: 1, // Only count users with status 1
      },
      group: [Sequelize.fn('TO_CHAR', Sequelize.col('createdAt'), 'YYYY-MM')], // Group by month
      order: [[Sequelize.fn('TO_CHAR', Sequelize.col('createdAt'), 'YYYY-MM'), 'ASC']], // Sort by month ascending
    });

    // Log result to verify the query output
    console.log("User counts fetched:", userCounts);

    res.json(userCounts);
  } catch (err) {
    // Log the exact error details for debugging
    console.error('Error in getUserCountForGraph:', err);

    res.status(500).json({
      error: 'Server error occurred while fetching user counts for the graph',
      message: err.message,
      stack: err.stack, // Added stack trace for more detailed error information
    });
  }
};
exports.getUserCountWithNullStatus = async (req, res) => {
  try {
    const count = await User.count({
      where: {
        status: null, // Only users with null status
      },
    });
    res.json({ userCountWithNullStatus: count });
  } catch (err) {
    console.error('Error in getUserCountWithNullStatus:', err.message);
    res.status(500).send('Server error');
  }
};

// Count users created within the last 14 days
exports.getUserCountLast14Days = async (req, res) => {
  try {
    const count = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 14 * 24 * 60 * 60 * 1000), // Created within the last 14 days
        },
      },
    });
    res.json({ userCountLast14Days: count });
  } catch (err) {
    console.error('Error in getUserCountLast14Days:', err.message);
    res.status(500).send('Server error');
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        status: {
          [Op.or]: [0, null]
        }
      }
    });
    res.status(200).json({ users: users });
  } catch (err) {
    console.error('Error in getUsers:', err.message);
    res.status(500).send('Server error');
  }
};
