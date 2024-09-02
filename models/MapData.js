// ../models/MapData.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MapData = sequelize.define('MapData', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  barangay: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  criticalLevel: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = MapData;
