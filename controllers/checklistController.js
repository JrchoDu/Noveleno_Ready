const Checklist = require('../models/Checklist'); 
const User = require('../models/User'); 
const getChecklist = async (req, res) => {
  try {
   
    if (!email) {
      return res.status(400).json({ message: 'Email not provided' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const checklist = await Checklist.findOne({ where: { userId: user.id } });
    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    res.json(checklist.checklistData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const saveChecklist = async (req, res) => {
  try {

    const email = req.body.auth && req.body.auth.email; 

    if (!email) {
      return res.status(400).json({ message: 'Email not provided' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find or create a checklist for the user
    let checklist = await Checklist.findOne({ where: { userId: user.id } });

    if (checklist) {
      // Update existing checklist
      checklist.checklistData = req.body.checklistData;
      await checklist.save();
      res.json({ checklistData: checklist.checklistData, created: false });
    } else {
      // Create new checklist
      checklist = await Checklist.create({
        userId: user.id,
        checklistData: req.body.checklistData
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
