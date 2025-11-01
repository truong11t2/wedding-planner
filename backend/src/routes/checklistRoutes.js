const express = require('express');
const router = express.Router();
const {
  getChecklist,
  saveChecklist,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  toggleChecklistItem
} = require('../controllers/checklistController');
const { protect } = require('../middleware/auth');

// GET /api/checklist - Get user's checklist
router.get('/', protect, getChecklist);

// POST /api/checklist/save - Save checklist to user profile
router.post('/', protect, saveChecklist);

    // POST /api/checklist/item - Add single checklist item
router.post('/item', protect, addChecklistItem);

// PUT /api/checklist/item/:itemId - Update checklist item
router.put('/item/:itemId', protect, updateChecklistItem);

// DELETE /api/checklist/item/:itemId - Delete checklist item
router.delete('/item/:itemId', protect, deleteChecklistItem);

// PATCH /api/checklist/item/:itemId/toggle - Toggle completion status
router.patch('/item/:itemId/toggle', protect, toggleChecklistItem);

module.exports = router;