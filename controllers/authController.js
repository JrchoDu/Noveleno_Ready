const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { email, password, confirmPassword, fullname, birthday, streetNumber, streetName, barangay, contactNumber } = req.body;

    console.log('Request Body:', req.body);

    if ( !email || !password || !confirmPassword || !fullname || !birthday || !streetNumber || !streetName || !barangay || !contactNumber) {
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


exports.registerAdmin = async (req, res) => {
  try {
    // Destructure only the required fields from the request body
    const { email, password, fullname, birthday, streetNumber, streetName, barangay, contactNumber } = req.body;

    console.log('Request Body:', req.body);

    // Check for required fields
    if (!email || !password || !fullname || !birthday || !streetNumber || !streetName || !barangay || !contactNumber) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check if the user already exists
    let existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin user with role 'Admin' and status '1'
    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullname,
      birthday,
      streetNumber,
      streetName,
      barangay,
      contactNumber,
      role: 'Admin', // Set the role to 'Admin'
      status: '1'    // Set status to '1' (active)
    });

    // Prepare the JWT payload
    const payload = {
      user: {
        id: newUser.id,
        role: newUser.role
      }
    };

    // Sign the JWT and send the response
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          email: newUser.email,
          fullname: newUser.fullname,
          role: newUser.role,
          birthday: newUser.birthday,
          streetNumber: newUser.streetNumber,
          streetName: newUser.streetName,
          barangay: newUser.barangay,
          contactNumber: newUser.contactNumber
        });
      }
    );

  } catch (err) {
    console.error('Error in registerAdmin:', err.message);
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

exports.editProfile = async (req, res) => {
  try {
    const { fullname, birthday, streetNumber, streetName, barangay, contactNumber } = req.body;
    const userId = req.user.id; // Assuming you get the user ID from the JWT token

    // Find the user
    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update user fields
    user.fullname = fullname || user.fullname;
    user.birthday = birthday || user.birthday;
    user.streetNumber = streetNumber || user.streetNumber;
    user.streetName = streetName || user.streetName;
    user.barangay = barangay || user.barangay;
    user.contactNumber = contactNumber || user.contactNumber;

    // Save the updated user data
    await user.save();

    res.json({
      msg: 'Profile updated successfully',
      user: {
        fullname: user.fullname,
        birthday: user.birthday,
        streetNumber: user.streetNumber,
        streetName: user.streetName,
        barangay: user.barangay,
        contactNumber: user.contactNumber
      }
    });

  } catch (err) {
    console.error('Error in editProfile:', err.message);
    res.status(500).send('Server error');
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, repeatNewPassword } = req.body;
    const userId = req.user.id; // Assuming you get the user ID from the JWT token

    // Find the user
    let user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect current password' });
    }

    // Check if new passwords match
    if (newPassword !== repeatNewPassword) {
      return res.status(400).json({ msg: 'New passwords do not match' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: 'Password updated successfully' });

  } catch (err) {
    console.error('Error in changePassword:', err.message);
    res.status(500).send('Server error');
  }
};
