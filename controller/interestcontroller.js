const { Interest, Idea, User } = require('../models');

// Express interest in an idea
const expressInterest = async (req, res) => {
  try {
    const { ideaId } = req.body;
    const investorId = req.user.id;

    // Check if investor already expressed interest
    const existingInterest = await Interest.findOne({
      where: { ideaId, investorId }
    });

    if (existingInterest) {
      return res.status(400).json({ 
        error: 'You have already expressed interest in this idea' 
      });
    }

    // Create interest
    const interest = await Interest.create({
      ideaId,
      investorId
    });

    // Get updated idea with interest count
    const idea = await Idea.findByPk(ideaId, {
      include: [{ model: Interest, as: 'interests' }]
    });

    res.status(201).json({
      message: 'Interest expressed successfully',
      interest,
      interestCount: idea.interests.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all interests (for admin)
const getAllInterests = async (req, res) => {
  try {
    const interests = await Interest.findAll({
      include: [
        { 
          model: Idea, 
          as: 'idea',
          include: [
            { model: User, as: 'author', attributes: ['id', 'username', 'email'] },
            { model: Interest, as: 'interests' } // For interest count
          ]
        },
        { 
          model: User, 
          as: 'investor', 
          attributes: ['id', 'username', 'email'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Add interestCount to each interest's idea
    const formattedInterests = interests.map(interest => ({
      ...interest.toJSON(),
      idea: {
        ...interest.idea?.toJSON(),
        interestCount: interest.idea?.interests?.length || 0
      }
    }));

    res.json(formattedInterests);
  } catch (err) {
    console.error('Get all interests error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all interests for a specific investor
const getMyInterests = async (req, res) => {
  try {
    const investorId = req.user.id;
    
    const interests = await Interest.findAll({
      where: { investorId },
      include: [
        { 
          model: Idea, 
          as: 'idea',
          include: [
            { model: User, as: 'author', attributes: ['id', 'username', 'email'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(interests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all interests for a specific idea (for idea owners)
const getIdeaInterests = async (req, res) => {
  try {
    const { ideaId } = req.params;
    
    const interests = await Interest.findAll({
      where: { ideaId },
      include: [
        { 
          model: User, 
          as: 'investor', 
          attributes: ['id', 'username', 'email'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(interests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update interest status (accept/reject)
const updateInterestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "accepted" or "rejected"' });
    }

    const interest = await Interest.findByPk(id, {
      include: [
        { 
          model: Idea, 
          as: 'idea',
          include: [{ model: User, as: 'author' }]
        }
      ]
    });
    
    if (!interest) {
      return res.status(404).json({ error: 'Interest not found' });
    }

    // Check if user is the idea owner or admin
    const isOwner = interest.idea?.authorId === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to update this interest' });
    }

    interest.status = status;
    await interest.save();

    res.json({ 
      message: `Interest ${status} successfully`,
      interest 
    });
  } catch (err) {
    console.error('Update interest status error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Remove interest
const removeInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const investorId = req.user.id;

    const interest = await Interest.findByPk(id);
    
    if (!interest) {
      return res.status(404).json({ error: 'Interest not found' });
    }

    // Check if user owns the interest
    if (interest.investorId !== investorId) {
      return res.status(403).json({ error: 'Not authorized to remove this interest' });
    }

    await interest.destroy();
    res.json({ message: 'Interest removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  expressInterest,
  getMyInterests,
  getIdeaInterests,
  removeInterest,
  getAllInterests,
  updateInterestStatus
};