const { Comment, User, Idea } = require('../models');

// Get all comments for a specific idea
const getCommentsByIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const comments = await Comment.findAll({
      where: { ideaId },
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'username', 'role'] 
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { ideaId, content } = req.body;
    const userId = req.user.id;
    const authorRole = req.user.role;

    const idea = await Idea.findByPk(ideaId);
    if (!idea) return res.status(404).json({ error: 'Idea not found' });

    const comment = await Comment.create({
      content,
      ideaId,
      userId,
      authorRole
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'role'] }
      ]
    });

    res.status(201).json(commentWithUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }

    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'role'] }
      ]
    });

    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCommentsByIdea,
  createComment,
  updateComment,
  deleteComment
};
