const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any email service provider (e.g., SendGrid, SMTP)
  auth: {
    user: 'bartertechgether@gmail.com', // Your email address
    pass: 'eawh ttpm uslk fcgr', // Your email password or app-specific password
  },
});

exports.getUserCount = async (req, res) => {
  try {
    const count = await User.count();
    res.json({ userCount: count });
  } catch (err) {
    console.error('Error in getUserCount:', err.message);
    res.status(500).send('Server error');
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

exports.acceptUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await user.update({ status: 1 });

    // Set up email options
    const mailOptions = {
      from: 'bartertechgether@gmail.com', // Sender address
      to: user.email, // The user's email address
      subject: 'Account Accepted',
      text: `Hello ${user.fullname},\n\nYour account has been accepted! You can now log in and start using our services.\n\nYou can log in here: https://novelenoready.mesph.online/\n\nBest regards,\nNoveleta Ready`,
    };

    // Send email to the user
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err.message);
        return res.status(500).json({ error: 'Error sending acceptance email' });
      } else {
        console.log('Email sent:', info.response);
        res.json({ msg: `User accepted with ID ${id} and email sent.` });
      }
    });
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

