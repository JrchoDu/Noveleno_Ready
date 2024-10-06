const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Get all contacts
router.get('/contacts', contactController.getAllContacts);

// Create a new contact
router.post('/contacts', contactController.createContact);

// Delete a contact by ID
router.delete('/contacts/:id', contactController.deleteContact);

module.exports = router;
