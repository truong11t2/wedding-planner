const User = require('../models/User');

// Get user's budget data
exports.getBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return budget data or default structure
    const budgetData = user.budgetData || {
      totalBudget: 25000,
      categories: [],
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: budgetData,
      message: 'Budget data retrieved successfully'
    });

  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving budget data'
    });
  }
};

// Save user's budget data
exports.saveBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalBudget, categories } = req.body;

    // Validate budget data
    if (typeof totalBudget !== 'number' || totalBudget < 0) {
      return res.status(400).json({
        success: false,
        message: 'Total budget must be a valid positive number'
      });
    }

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Categories must be an array'
      });
    }

    // Validate each category structure
    const isValidCategory = (category) => {
      return (
        category &&
        typeof category.id === 'string' &&
        typeof category.name === 'string' &&
        typeof category.budgeted === 'number' &&
        typeof category.spent === 'number' &&
        typeof category.color === 'string' &&
        typeof category.description === 'string' &&
        ['high', 'medium', 'low'].includes(category.priority) &&
        category.budgeted >= 0 &&
        category.spent >= 0
      );
    };

    const invalidCategories = categories.filter(category => !isValidCategory(category));
    if (invalidCategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category format',
        invalidCategories
      });
    }

    // Update user's budget data
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const budgetData = {
      totalBudget,
      categories,
      lastUpdated: new Date().toISOString()
    };

    user.budgetData = budgetData;
    await user.save();

    res.status(200).json({
      success: true,
      data: user.budgetData,
      message: 'Budget data saved successfully'
    });

  } catch (error) {
    console.error('Save budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving budget data'
    });
  }
};

// Update total budget only
exports.updateTotalBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalBudget } = req.body;

    // Validate total budget
    if (typeof totalBudget !== 'number' || totalBudget < 0) {
      return res.status(400).json({
        success: false,
        message: 'Total budget must be a valid positive number'
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get existing budget data or initialize
    const currentBudgetData = user.budgetData || {
      totalBudget: 25000,
      categories: [],
      lastUpdated: new Date().toISOString()
    };

    // Update only the total budget
    const updatedBudgetData = {
      ...currentBudgetData,
      totalBudget,
      lastUpdated: new Date().toISOString()
    };

    user.budgetData = updatedBudgetData;
    await user.save();

    res.status(200).json({
      success: true,
      data: user.budgetData,
      message: 'Total budget updated successfully'
    });

  } catch (error) {
    console.error('Update total budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating total budget'
    });
  }
};

// Add a single budget category
exports.addBudgetCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name, 
      budgeted, 
      spent, 
      color, 
      description, 
      priority 
    } = req.body;

    // Validate required fields
    if (!name || typeof budgeted !== 'number' || budgeted < 0) {
      return res.status(400).json({
        success: false,
        message: 'Name and valid budgeted amount are required'
      });
    }

    if (!['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be high, medium, or low'
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get existing budget data or initialize
    const currentBudgetData = user.budgetData || {
      totalBudget: 25000,
      categories: [],
      lastUpdated: new Date().toISOString()
    };

    // Generate new ID (timestamp-based)
    const newId = Date.now().toString();

    // Create new category
    const newCategory = {
      id: newId,
      name: name.trim(),
      budgeted: parseFloat(budgeted) || 0,
      spent: parseFloat(spent) || 0,
      color: color || 'bg-blue-500',
      description: description?.trim() || '',
      priority
    };

    // Add to categories
    const updatedCategories = [...currentBudgetData.categories, newCategory];
    const updatedBudgetData = {
      ...currentBudgetData,
      categories: updatedCategories,
      lastUpdated: new Date().toISOString()
    };

    user.budgetData = updatedBudgetData;
    await user.save();

    res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Budget category added successfully'
    });

  } catch (error) {
    console.error('Add budget category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding budget category'
    });
  }
};

// Update a budget category
exports.updateBudgetCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoryId } = req.params;
    const updates = req.body;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentBudgetData = user.budgetData || {
      totalBudget: 25000,
      categories: [],
      lastUpdated: new Date().toISOString()
    };

    const categoryIndex = currentBudgetData.categories.findIndex(cat => cat.id === categoryId);

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Budget category not found'
      });
    }

    // Validate updates
    if (updates.budgeted !== undefined && (typeof updates.budgeted !== 'number' || updates.budgeted < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Budgeted amount must be a valid positive number'
      });
    }

    if (updates.spent !== undefined && (typeof updates.spent !== 'number' || updates.spent < 0)) {
      return res.status(400).json({
        success: false,
        message: 'Spent amount must be a valid positive number'
      });
    }

    if (updates.priority && !['high', 'medium', 'low'].includes(updates.priority)) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be high, medium, or low'
      });
    }

    // Update the category
    const updatedCategory = { 
      ...currentBudgetData.categories[categoryIndex], 
      ...updates,
      // Ensure we don't change the ID
      id: currentBudgetData.categories[categoryIndex].id
    };
    
    currentBudgetData.categories[categoryIndex] = updatedCategory;
    
    const updatedBudgetData = {
      ...currentBudgetData,
      lastUpdated: new Date().toISOString()
    };

    user.budgetData = updatedBudgetData;
    await user.save();

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: 'Budget category updated successfully'
    });

  } catch (error) {
    console.error('Update budget category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating budget category'
    });
  }
};

// Delete a budget category
exports.deleteBudgetCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoryId } = req.params;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentBudgetData = user.budgetData || {
      totalBudget: 25000,
      categories: [],
      lastUpdated: new Date().toISOString()
    };

    const categoryIndex = currentBudgetData.categories.findIndex(cat => cat.id === categoryId);

    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Budget category not found'
      });
    }

    // Remove the category
    const deletedCategory = currentBudgetData.categories.splice(categoryIndex, 1)[0];
    
    const updatedBudgetData = {
      ...currentBudgetData,
      lastUpdated: new Date().toISOString()
    };

    user.budgetData = updatedBudgetData;
    await user.save();

    res.status(200).json({
      success: true,
      data: deletedCategory,
      message: 'Budget category deleted successfully'
    });

  } catch (error) {
    console.error('Delete budget category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting budget category'
    });
  }
};

// Get budget statistics
exports.getBudgetStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const budgetData = user.budgetData || {
      totalBudget: 25000,
      categories: [],
      lastUpdated: new Date().toISOString()
    };

    const { totalBudget, categories } = budgetData;
    
    const stats = {
      totalBudget,
      totalBudgeted: categories.reduce((sum, cat) => sum + cat.budgeted, 0),
      totalSpent: categories.reduce((sum, cat) => sum + cat.spent, 0),
      totalRemaining: totalBudget - categories.reduce((sum, cat) => sum + cat.spent, 0),
      categoryCount: categories.length,
      overBudgetCategories: categories.filter(cat => cat.spent > cat.budgeted).length,
      categories: {
        high: categories.filter(cat => cat.priority === 'high').length,
        medium: categories.filter(cat => cat.priority === 'medium').length,
        low: categories.filter(cat => cat.priority === 'low').length
      },
      budgetUsedPercentage: totalBudget > 0 ? (categories.reduce((sum, cat) => sum + cat.spent, 0) / totalBudget) * 100 : 0
    };

    res.status(200).json({
      success: true,
      data: stats,
      message: 'Budget statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Get budget stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving budget statistics'
    });
  }
};