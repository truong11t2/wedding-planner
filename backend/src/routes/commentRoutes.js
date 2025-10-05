const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByBlogPost,
  getAllComments,
  approveComment,
  deleteComment
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.post('/', createComment);
router.get('/post/:blogPostId', getCommentsByBlogPost);
router.get('/', protect, getAllComments);
router.put('/:id/approve', protect, approveComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;