const Comment = require('../models/Comment');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email notification to admin
async function sendAdminNotification(comment, blogPostId) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    
    if (!adminEmail) {
      console.warn('Admin email not configured, skipping notification');
      return;
    }

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Wedding Planner'}" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Comment on Blog Post: ${blogPostId}`,
      html: `
        <h2>New Comment Received</h2>
        <p><strong>Blog Post:</strong> ${blogPostId}</p>
        <p><strong>From:</strong> ${comment.name} (${comment.email})</p>
        <p><strong>Type:</strong> ${comment.isAnonymous ? 'Anonymous' : 'Registered User'}</p>
        <p><strong>Message:</strong></p>
        <blockquote>${comment.message}</blockquote>
        <p><strong>Posted:</strong> ${new Date(comment.createdAt).toLocaleString()}</p>
        <hr>
        <p><em>This is an automated notification from your Wedding Planner blog.</em></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Admin notification sent for comment on ${blogPostId}`);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

// @desc    Create new comment
// @route   POST /api/comments
// @access  Public
exports.createComment = async (req, res) => {
  try {
    const { blogPostId, name, email, message } = req.body;
    const userId = req.user?.id; // From auth middleware if logged in

    // Validate input
    if (!blogPostId || !message) {
      return res.status(400).json({ 
        success: false,
        message: 'Blog post ID and message are required' 
      });
    }

    let commentData = {
      blogPostId,
      message,
      isApproved: true, // Auto-approve (can change to false for moderation)
    };

    // If user is logged in
    if (userId) {
      const user = await User.findByPk(userId);
      if (user) {
        commentData.userId = userId;
        commentData.name = `${user.firstName} ${user.lastName}`;
        commentData.email = user.email;
        commentData.isAnonymous = false;
      }
    } else {
      // Anonymous user - require name and email
      if (!name || !email) {
        return res.status(400).json({ 
          success: false,
          message: 'Name and email are required for anonymous comments' 
        });
      }
      
      commentData.name = name;
      commentData.email = email;
      commentData.isAnonymous = true;
    }

    // Create comment
    const comment = await Comment.create(commentData);

    // Send email notification to admin
    await sendAdminNotification(comment, blogPostId);

    res.status(201).json({
      success: true,
      comment: {
        id: comment.id,
        name: comment.name,
        message: comment.message,
        createdAt: comment.createdAt,
        isAnonymous: comment.isAnonymous
      }
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ 
      success: false,
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