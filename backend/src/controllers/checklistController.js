const User = require('../models/User');

// Get user's checklist
exports.getChecklist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return checklist data or default empty array
    const checklistData = user.checklistData || [];

    res.status(200).json({
      success: true,
      data: checklistData,
      message: 'Checklist retrieved successfully'
    });

  } catch (error) {
    console.error('Get checklist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving checklist'
    });
  }
};

// Save user's checklist
exports.saveChecklist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { checklistItems } = req.body;

    // Validate checklist items
    if (!Array.isArray(checklistItems)) {
      return res.status(400).json({
        success: false,
        message: 'Checklist items must be an array'
      });
    }

    // Validate each checklist item structure
    const isValidItem = (item) => {
      return (
        item &&
        typeof item.id === 'number' &&
        typeof item.task === 'string' &&
        typeof item.category === 'string' &&
        typeof item.completed === 'boolean' &&
        ['high', 'medium', 'low'].includes(item.priority)
      );
    };

    const invalidItems = checklistItems.filter(item => !isValidItem(item));
    if (invalidItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid checklist item format',
        invalidItems
      });
    }

    // Update user's checklist
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.checklistData = checklistItems;
    await user.save();

    res.status(200).json({
      success: true,
      data: user.checklistData,
      message: 'Checklist saved successfully'
    });

  } catch (error) {
    console.error('Save checklist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving checklist'
    });
  }
};

// Add a single checklist item
exports.addChecklistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { task, category, priority } = req.body;

    // Validate required fields
    if (!task || !category || !priority) {
      return res.status(400).json({
        success: false,
        message: 'Task, category, and priority are required'
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

    // Get existing checklist or initialize empty array
    const currentChecklist = user.checklistData || [];
    
    // Generate new ID (find max existing ID + 1)
    const newId = currentChecklist.length > 0 
      ? Math.max(...currentChecklist.map(item => item.id)) + 1 
      : 1;

    // Create new checklist item
    const newItem = {
      id: newId,
      task: task.trim(),
      category,
      priority,
      completed: false
    };

    // Add to checklist
    const updatedChecklist = [...currentChecklist, newItem];
    user.checklistData = updatedChecklist;
    await user.save();

    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Checklist item added successfully'
    });

  } catch (error) {
    console.error('Add checklist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding checklist item'
    });
  }
};

// Update a checklist item
exports.updateChecklistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const updates = req.body;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentChecklist = user.checklistData || [];
    const itemIndex = currentChecklist.findIndex(item => item.id === parseInt(itemId));

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Checklist item not found'
      });
    }

    // Update the item
    const updatedItem = { ...currentChecklist[itemIndex], ...updates };
    currentChecklist[itemIndex] = updatedItem;
    
    user.checklistData = currentChecklist;
    await user.save();

    res.status(200).json({
      success: true,
      data: updatedItem,
      message: 'Checklist item updated successfully'
    });

  } catch (error) {
    console.error('Update checklist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating checklist item'
    });
  }
};

// Delete a checklist item
exports.deleteChecklistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentChecklist = user.checklistData || [];
    const itemIndex = currentChecklist.findIndex(item => item.id === parseInt(itemId));

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Checklist item not found'
      });
    }

    // Remove the item
    const deletedItem = currentChecklist.splice(itemIndex, 1)[0];
    
    user.checklistData = currentChecklist;
    await user.save();

    res.status(200).json({
      success: true,
      data: deletedItem,
      message: 'Checklist item deleted successfully'
    });

  } catch (error) {
    console.error('Delete checklist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting checklist item'
    });
  }
};

// Toggle checklist item completion
exports.toggleChecklistItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentChecklist = user.checklistData || [];
    const itemIndex = currentChecklist.findIndex(item => item.id === parseInt(itemId));

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Checklist item not found'
      });
    }

    // Toggle completion status
    currentChecklist[itemIndex].completed = !currentChecklist[itemIndex].completed;
    
    user.checklistData = currentChecklist;
    await user.save();

    res.status(200).json({
      success: true,
      data: currentChecklist[itemIndex],
      message: 'Checklist item toggled successfully'
    });

  } catch (error) {
    console.error('Toggle checklist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling checklist item'
    });
  }
};