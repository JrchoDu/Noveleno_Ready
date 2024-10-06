const Contact = require('../models/Contact');

// Get all contacts
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
  }
};

// Create a new contact
const createContact = async (req, res) => {
  const { name, contact_no } = req.body;

  // Check if required fields are provided
  if (!name || !contact_no) {
    return res.status(400).json({ message: 'Name and contact number are required' });
  }

  // Ensure contact_no is being passed correctly
  console.log('Creating contact with name:', name, 'and contact_no:', contact_no); // Debugging log

  try {
    const newContact = await Contact.create({
      name,
      contact_no
    });

    res.status(201).json(newContact); // Return the created contact
  } catch (error) {
    res.status(500).json({ message: 'Failed to create contact', error: error.message });
  }
};

// Delete a contact by ID
const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.destroy({ where: { id } });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact', error: error.message });
  }
};

module.exports = {
  getAllContacts,
  createContact,
  deleteContact
};
