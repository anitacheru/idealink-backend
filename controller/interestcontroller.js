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
  removeInterest
};