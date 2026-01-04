const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByBlogPost,
  getAllComments,
  approveComment,
  deleteComment
} = require('../controllers/commentController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

// Optional auth middleware - attaches user if logged in, but doesn't require it
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    if (req.cookies?.authToken || req.headers.authorization) {
      return protect(req, res, next);
    }
    next();
  } catch (error) {
    next();
  }
};

router.post('/', optionalAuthMiddleware, createComment);
router.get('/post/:blogPostId', getCommentsByBlogPost);
router.get('/', protect, getAllComments);
router.put('/:id/approve', protect, approveComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;