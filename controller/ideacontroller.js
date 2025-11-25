const { Idea, User, Interest } = require('../models');

// Create new idea
const createIdea = async (req, res) => {
  try {
    const { title, description } = req.body;
    const authorId = req.user.id; // assumes auth middleware populates req.user
    const idea = await Idea.create({ title, description, authorId });
    res.status(201).json(idea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all ideas, including interest count for each
const getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.findAll({
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Interest, as: 'interests', attributes: [] }
      ]
    });
    const ideasWithInterestCount = ideas.map(idea => {
      const ideaObj = idea.toJSON();
      ideaObj.interestCount = Array.isArray(idea.interests) ? idea.interests.length : 0;
      return ideaObj;
    });
    res.json(ideasWithInterestCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single idea by ID with interest count
const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findByPk(req.params.id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Interest, as: 'interests', attributes: [] }
      ]
    });
    if (!idea) return res.status(404).json({ msg: "Idea not found" });
    const ideaObj = idea.toJSON();
    ideaObj.interestCount = Array.isArray(idea.interests) ? idea.interests.length : 0;
    res.json(ideaObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createIdea,
  getIdeas,
  getIdeaById
};
