const { Sequelize, Op } = require('sequelize');
const User = require('../models/User'); 

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
