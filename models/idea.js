const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Idea = sequelize.define('Idea', {
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM('pending', 'approved', 'rejected'), 
    defaultValue: 'pending' 
  },
  imageUrl: { 
    type: DataTypes.STRING 
  },
  problemSolved: { 
    type: DataTypes.TEXT 
  },
  solutionProposed: { 
    type: DataTypes.TEXT 
  },
  
  // Admin review fields
  adminFeedback: { 
    type: DataTypes.TEXT 
  },
  reviewedAt: { 
    type: DataTypes.DATE 
  },
  reviewedBy: { 
    type: DataTypes.INTEGER 
  },
  
  // Organization fields
  category: { 
    type: DataTypes.ENUM('technology', 'healthcare', 'finance', 'education', 'environment', 'other'),
    defaultValue: 'other'
  },
  tags: { 
    type: DataTypes.JSON,
    defaultValue: []
  },
  
  // Analytics
  viewCount: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  }
}, {
  timestamps: true
});

module.exports = Idea;
