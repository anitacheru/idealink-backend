const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Comment = sequelize.define('Comment', { 
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorRole: {
    type: DataTypes.ENUM('investor', 'idea-generator'),
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Comment;
