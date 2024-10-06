const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');  

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_no: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false  
});

module.exports = Contact;
