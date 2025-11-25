const { Interest, Idea, User } = require('../models');

// Handler for investor expressing interest in an idea
const expressInterest = async (req, res) => {
  try {
    const { ideaId } = req.body;
    // Prevent duplicate interests
    const existing = await Interest.findOne({ where: { ideaId, investorId: req.user.id } });
    if (existing) {
      return res.status(400).json({ error: "You have already expressed interest in this idea." });
    }
    const interest = await Interest.create({ ideaId, investorId: req.user.id, status: "pending" });
    res.status(201).json(interest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Handler for listing interests with idea interest count
const getInterests = async (req, res) => {
  try {
    const interests = await Interest.findAll({
      where: { investorId: req.user.id },
      include: [
        { model: Idea, as: 'idea', include: [{ model: Interest, as: 'interests', attributes: [] }] },
        { model: User, as: 'investor', attributes: ['username', 'email'] }
      ]
    });
    // Add interestCount to each idea
    const enriched = interests.map(inter => {
      const obj = inter.toJSON();
      if (obj.idea) {
        obj.idea.interestCount = Array.isArray(obj.idea.interests) ? obj.idea.interests.length : 0;
      }
      return obj;
    });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Handler for updating interest status (accept/reject)
const updateInterest = async (req, res) => {
  try {
    const { status } = req.body;
    const interest = await Interest.findByPk(req.params.id);
    if (!interest) return res.status(404).json({ error: "Interest not found" });
    interest.status = status;
    await interest.save();
    res.json({ msg: "Interest updated", interest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  expressInterest,
  getInterests,
  updateInterest
};
