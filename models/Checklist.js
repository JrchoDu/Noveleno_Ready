const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Adjust path as needed

const Checklist = sequelize.define('checklist', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Assuming your user table is named 'users'
      key: 'id'
    }
  },
  checklistData: {
    type: DataTypes.JSONB, // Use JSONB for storing JSON data
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Checklist;
