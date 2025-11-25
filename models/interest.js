const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Interest = sequelize.define('Interest', {
  status: { type: DataTypes.ENUM('pending', 'accepted', 'rejected'), defaultValue: 'pending' }
}, {
  timestamps: true
});

module.exports = Interest;
