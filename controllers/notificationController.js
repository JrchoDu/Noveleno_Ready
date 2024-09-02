const NotificationAlert = require('../models/NotificationAlert'); 
// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { user_id, level, description } = req.body;

    const newNotification = await NotificationAlert.create({
      userId: user_id,
      level,
      description,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: newNotification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the notification'
    });
  }
};

// Get all notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationAlert.findAll();

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the notifications'
    });
  }
};

// Get a specific notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notification = await NotificationAlert.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the notification'
    });
  }
};

// Update a specific notification by ID
const updateNotification = async (req, res) => {
  try {
    const { user_id, level, description } = req.body;
    const notification = await NotificationAlert.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.userId = user_id || notification.userId;
    notification.level = level || notification.level;
    notification.description = description || notification.description;

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification updated successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the notification'
    });
  }
};

// Delete a specific notification by ID
const deleteNotification = async (req, res) => {
  try {
    const notification = await NotificationAlert.findByPk(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the notification'
    });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification
};
