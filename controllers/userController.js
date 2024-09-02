const User = require('../models/User');

exports.getUserCount = async (req, res) => {
  try {
    const count = await User.count();
    res.json({ userCount: count });
  } catch (err) {
    console.error('Error in getUserCount:', err.message);
    res.status(500).send('Server error');
  }
};

exports.acceptUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.update({ status: 1 });

    res.json({ msg: `User accepted with ID ${id}` });
  } catch (error) {
    console.error('Error accepting user:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.showAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Fetch all users
    res.json(users); // Respond with the list of users
  } catch (error) {
    console.error('Error in showAllUsers:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Function to get a specific user by email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.query; // Should correctly extract the email from the query string

  if (!email) {
    console.error('Email parameter is undefined');
    return res.status(400).json({ error: 'Email parameter is missing or undefined' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getUserByEmail:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

