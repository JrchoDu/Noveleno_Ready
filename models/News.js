const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class News extends Model {}

News.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  barangay: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0  // Default to 0 for non-admins
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,  // The expiration date must be defined
  }
}, {
  sequelize,
  modelName: 'News',
});

module.exports = News;
