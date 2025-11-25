const sequelize = require('../config/db');
const User = require('./user');
const Idea = require('./idea');
const Interest = require('./interest');

Idea.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(Idea, { foreignKey: 'authorId', as: 'ideas' });
Interest.belongsTo(User, { foreignKey: 'investorId', as: 'investor' });
Interest.belongsTo(Idea, { foreignKey: 'ideaId', as: 'idea' });
User.hasMany(Interest, { foreignKey: 'investorId', as: 'sentInterests' });
Idea.hasMany(Interest, { foreignKey: 'ideaId', as: 'interests' });

module.exports = { sequelize, User, Idea, Interest };
