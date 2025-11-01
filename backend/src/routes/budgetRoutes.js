const express = require('express');
const router = express.Router();
const {
  getBudget,
  getBudgetStats,
  saveBudget,
  updateTotalBudget,
  addBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory
} = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

// GET /api/budget - Get user's budget data
router.get('/', protect, getBudget);

// GET /api/budget/stats - Get budget statistics
router.get('/stats', protect, getBudgetStats);

// POST /api/budget - Save entire budget data
router.post('/', protect, saveBudget);

// PUT /api/budget/total - Update total budget only
router.put('/total', protect, updateTotalBudget);

// POST /api/budget/category - Add single budget category
router.post('/category', protect, addBudgetCategory);

// PUT /api/budget/category/:categoryId - Update budget category
router.put('/category/:categoryId', protect, updateBudgetCategory);

// DELETE /api/budget/category/:categoryId - Delete budget category
router.delete('/category/:categoryId', protect, deleteBudgetCategory);

module.exports = router;