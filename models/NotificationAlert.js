const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const NotificationAlert = sequelize.define('NotificationAlert', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        },
        field: 'user_id'
    },
    level: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'notification_alert',
    timestamps: false
});

module.exports = NotificationAlert;
