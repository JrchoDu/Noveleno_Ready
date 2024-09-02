const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Route to send a message
router.post('/messages', messageController.createConversation);

// Route to fetch messages between two users
router.get('/messages', messageController.fetchMessages);

module.exports = router;