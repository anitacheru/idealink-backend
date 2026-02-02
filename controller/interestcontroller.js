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

module.exports = {
  expressInterest,
  getMyInterests,
  getIdeaInterests,
  removeInterest,
  getAllInterests,      // ADD THIS
  updateInterestStatus  // ADD THIS
};