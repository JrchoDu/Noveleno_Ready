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
