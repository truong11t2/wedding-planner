const Comment = require('../models/Comment');

// @desc    Create new comment
// @route   POST /api/comments
// @access  Public
exports.createComment = async (req, res) => {
  try {
    const { blogPostId, name, email, message } = req.body;

    // Validate input
    if (!blogPostId || !name || !email || !message) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Create comment
    const comment = await Comment.create({
      blogPostId,
      name,
      email,
      message,
      isApproved: false // Requires admin approval
    });

    res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get comments for a blog post
// @route   GET /api/comments/:blogPostId
// @access  Public
exports.getCommentsByBlogPost = async (req, res) => {
  try {
    const { blogPostId } = req.params;

    const comments = await Comment.findAll({
      where: { 
        blogPostId,
        isApproved: true // Only show approved comments
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Get all comments (admin)
// @route   GET /api/comments
// @access  Private/Admin
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: comments.length,
      comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Approve comment
// @route   PUT /api/comments/:id/approve
// @access  Private/Admin
exports.approveComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.isApproved = true;
    await comment.save();

    res.json({
      success: true,
      comment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private/Admin
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.destroy();

    res.json({
      success: true,
      message: 'Comment deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};