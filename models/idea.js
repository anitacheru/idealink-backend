const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Idea = sequelize.define('Idea', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  imageUrl: { type: DataTypes.STRING },
  problemSolved: { type: DataTypes.TEXT },
  solutionProposed: { type: DataTypes.TEXT },
}, {
  timestamps: true
});

module.exports = Idea;
