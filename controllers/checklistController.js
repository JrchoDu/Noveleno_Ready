const Checklist = require('../models/Checklist');
const User = require('../models/User');

const getChecklist = async (req, res) => {
  try {
    const { email, checklistType } = req.query; // Use query parameters

    if (!email || !checklistType) {
      return res.status(400).json({ message: 'Email or checklist type not provided' });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the checklist by userId and checklistType
    const checklist = await Checklist.findOne({ where: { userId: user.id, checklistType } });
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    // Send checklist data as JSON
    res.json({
      email: email,
      checklistData: checklist.checklistData,
      checklistType: checklist.checklistType
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const saveChecklist = async (req, res) => {
  try {
    const { email, checklistData, checklistType } = req.body; 

    if (!email || !checklistData || !checklistType) {
      return res.status(400).json({ message: 'Email, checklist data, or checklist type not provided' });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create the checklist
    let checklist = await Checklist.findOne({ where: { userId: user.id, checklistType } });

    if (checklist) {
      // Update existing checklist
      checklist.checklistData = checklistData;
      await checklist.save();
      res.json({ checklistData: checklist.checklistData, created: false });
    } else {
      // Create new checklist
      checklist = await Checklist.create({
        userId: user.id,
        checklistData,
        checklistType
      });
      res.json({ checklistData: checklist.checklistData, created: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getChecklist,
  saveChecklist
};
