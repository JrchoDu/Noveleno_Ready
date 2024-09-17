const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, fullname, birthday, streetNumber, streetName, barangay, contactNumber } = req.body;

    console.log('Request Body:', req.body);

    if (!username || !email || !password || !confirmPassword || !fullname || !birthday || !streetNumber || !streetName || !barangay || !contactNumber) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    let existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullname,
      birthday,
      streetNumber,
      streetName,
      barangay,
      contactNumber
    });

    const user = await User.findOne({ where: { id: newUser.id } });

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          email: user.email,
          username: '',
          fullname: user.fullname,
          role: user.role,
          birthday: user.birthday,
          streetNumber: user.streetNumber,
          streetName: user.streetName,
          barangay: user.barangay,
          contactNumber: user.contactNumber
        });
      }
    );

  } catch (err) {
    console.error('Error in registerUser:', err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (user.status !== 1) {
      return res.status(400).json({ msg: 'Account is not active' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          email: user.email,
          username: user.username,
          fullname: user.fullname,
          role: user.role,
          birthday: user.birthday,
          streetNumber: user.streetNumber,
          streetName: user.streetName,
          barangay: user.barangay,
          contactNumber: user.contactNumber
        });
      }
    );

  } catch (err) {
    console.error('Error in loginUser:', err.message);
    res.status(500).send('Server error');
  }
};
