const { Sequelize, Op } = require('sequelize');
const User = require('../models/User'); 

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

exports.getUserCountForGraph = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Optional filters for the date range

    // Parse date inputs, or set defaults (last 12 months)
    const start = startDate ? new Date(startDate) : new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const end = endDate ? new Date(endDate) : new Date();

    const userCounts = await User.findAll({
      attributes: [
        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'month'], // Group by month
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'] // Count users
      ],
      where: {
        createdAt: {
          [Op.between]: [start, end], // Filter by date range
        },
        status: 1, // Filter by status = 1
      },
      group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt'))], // Group by month
      order: [[Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('createdAt')), 'ASC']], // Sort in ascending order by month
    });

    res.json(userCounts);
  } catch (err) {
    console.error('Error in getUserCountForGraph:', err.message);
    res.status(500).send('Server error');
  }
};