const sequelize = require('../config/db');
const User = require('./user');
const Idea = require('./idea');
const Interest = require('./interest');
const Comment = require('./comment');

// Idea <-> User associations
Idea.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(Idea, { foreignKey: 'authorId', as: 'ideas' });

// Interest <-> User & Idea associations
Interest.belongsTo(User, { foreignKey: 'investorId', as: 'investor' });
Interest.belongsTo(Idea, { foreignKey: 'ideaId', as: 'idea' });
User.hasMany(Interest, { foreignKey: 'investorId', as: 'sentInterests' });
Idea.hasMany(Interest, { foreignKey: 'ideaId', as: 'interests' });

// Comment <-> Idea & User associations
Comment.belongsTo(Idea, { foreignKey: 'ideaId', as: 'idea' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Idea.hasMany(Comment, { foreignKey: 'ideaId', as: 'comments' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });

module.exports = { sequelize, User, Idea, Interest, Comment };
