// models/Checklist.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

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
      model: 'users', 
      key: 'id'
    }
  },
  checklistData: {
    type: DataTypes.JSON, 
    allowNull: false
  },
  checklistType: {  // Added this field
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'checklists'
});

module.exports = Checklist;
