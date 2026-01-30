const { Idea, User, Interest, Comment } = require('../models');
const { Op } = require('sequelize');

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalIdeas = await Idea.count();
    const pendingIdeas = await Idea.count({ where: { status: 'pending' } });
    const approvedIdeas = await Idea.count({ where: { status: 'approved' } });
    const rejectedIdeas = await Idea.count({ where: { status: 'rejected' } });
    
    const totalUsers = await User.count();
    const ideaGenerators = await User.count({ where: { role: 'idea-generator' } });
    const investors = await User.count({ where: { role: 'investor' } });
    
    const totalInterests = await Interest.count();
    const totalComments = await Comment.count();

    // Recent activity
    const recentIdeas = await Idea.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'author', attributes: ['username', 'email'] }]
    });

    res.json({
      stats: {
        ideas: { total: totalIdeas, pending: pendingIdeas, approved: approvedIdeas, rejected: rejectedIdeas },
        users: { total: totalUsers, ideaGenerators, investors },
        engagement: { totalInterests, totalComments }
      },
      recentIdeas
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all pending ideas
const getPendingIdeas = async (req, res) => {
  try {
    const ideas = await Idea.findAll({
      where: { status: 'pending' },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'email'] },
        { model: Interest, as: 'interests' },
        { model: Comment, as: 'comments' }
      ],
      order: [['createdAt', 'DESC']]
    });

    const ideasWithCounts = ideas.map(idea => ({
      ...idea.toJSON(),
      interestCount: idea.interests?.length || 0,
      commentCount: idea.comments?.length || 0
    }));

    res.json(ideasWithCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve idea
const approveIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const idea = await Idea.findByPk(id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    idea.status = 'approved';
    idea.adminFeedback = feedback || null;
    idea.reviewedAt = new Date();
    idea.reviewedBy = req.user.id;
    await idea.save();

    // Award points to user
    const author = await User.findByPk(idea.authorId);
    if (author) {
      author.points = (author.points || 0) + 20;
      await author.save();
    }

    res.json({ message: 'Idea approved successfully', idea });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject idea
const rejectIdea = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const idea = await Idea.findByPk(id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    idea.status = 'rejected';
    idea.adminFeedback = feedback || 'Does not meet platform guidelines';
    idea.reviewedAt = new Date();
    idea.reviewedBy = req.user.id;
    await idea.save();

    res.json({ message: 'Idea rejected', idea });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: Idea, as: 'ideas' },
        { model: Interest, as: 'sentInterests' }
      ],
      order: [['createdAt', 'DESC']]
    });

    const usersWithCounts = users.map(user => ({
      ...user.toJSON(),
      ideaCount: user.ideas?.length || 0,
      interestCount: user.sentInterests?.length || 0
    }));

    res.json(usersWithCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete idea
const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;
    
    const idea = await Idea.findByPk(id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    await idea.destroy();
    res.json({ message: 'Idea deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardStats,
  getPendingIdeas,
  approveIdea,
  rejectIdea,
  getAllUsers,
  deleteUser,
  deleteIdea
};