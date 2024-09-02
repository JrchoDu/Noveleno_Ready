const User = require('../models/User');
const Message = require('../models/Message');
const { Op } = require('sequelize');

const getUserIdByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user ? user.id : null;
};

const fetchMessages = async (req, res) => {
  const { senderEmail, receiverEmail } = req.query;

  try {
    const senderId = await getUserIdByEmail(senderEmail);
    const receiverId = await getUserIdByEmail(receiverEmail);

    if (!senderId || !receiverId) {
      return res.status(404).json({ error: 'Sender or Receiver not found' });
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      },
      order: [['createdAt', 'ASC']]  // Use the correct column name
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const createConversation = async (req, res) => {
  const { senderEmail, receiverEmail, content } = req.body;

  // Validate content
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Message content cannot be empty.' });
  }

  try {
    // Find sender and receiver users
    const sender = await User.findOne({ where: { email: senderEmail } });
    const receiver = await User.findOne({ where: { email: receiverEmail } });

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Create a new message
    const newMessage = await Message.create({
      senderId: sender.id,
      receiverId: receiver.id,
      content: content.trim(),
    });

    res.status(201).json({ message: 'Message sent successfully!', newMessage });
  } catch (error) {
    console.error('Failed to create conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation.' });
  }
};


module.exports = {
  fetchMessages,
  createConversation,
};