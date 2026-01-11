const User = require('../models/User');

// Get user's checklist
exports.getChecklist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Return checklist data or default empty array
    const checklistData = user.checklistData || [];

    res.status(200).json({
      success: true,
      data: checklistData,
      message: 'Nhiệm vụ đã được lấy thành công'
    });

  } catch (error) {
    console.error('Get checklist error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy nhiệm vụ'
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
        message: 'Danh sách nhiệm vụ phải là một mảng'
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
        ['cao', 'trung bình', 'thấp'].includes(item.priority)
      );
    };

    const invalidItems = checklistItems.filter(item => !isValidItem(item));
    if (invalidItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Định dạng nhiệm vụ không hợp lệ',
        invalidItems
      });
    }

    // Update user's checklist
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    user.checklistData = checklistItems;
    await user.save();

    res.status(200).json({
      success: true,
      data: user.checklistData,
      message: 'Nhiệm vụ đã được lưu thành công'
    });

  } catch (error) {
    console.error('Save checklist error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lưu nhiệm vụ'
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
        message: 'Nhiệm vụ, danh mục, và độ ưu tiên là bắt buộc'
      });
    }

    if (!['cao', 'trung bình', 'thấp'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Độ ưu tiên phải là cao, trung bình, hoặc thấp'
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
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
      message: 'Nhiệm vụ đã được thêm thành công'
    });

  } catch (error) {
    console.error('Add checklist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi thêm nhiệm vụ'
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
        message: 'Không tìm thấy người dùng'
      });
    }

    const currentChecklist = user.checklistData || [];
    const itemIndex = currentChecklist.findIndex(item => item.id === parseInt(itemId));

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhiệm vụ'
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
      message: 'Nhiệm vụ đã được cập nhật thành công'
    });

  } catch (error) {
    console.error('Update checklist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi cập nhật nhiệm vụ'
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
        message: 'Không tìm thấy người dùng'
      });
    }

    const currentChecklist = user.checklistData || [];
    const itemIndex = currentChecklist.findIndex(item => item.id === parseInt(itemId));

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhiệm vụ'
      });
    }

    // Remove the item
    const deletedItem = currentChecklist.splice(itemIndex, 1)[0];
    
    user.checklistData = currentChecklist;
    await user.save();

    res.status(200).json({
      success: true,
      data: deletedItem,
      message: 'Nhiệm vụ đã được xóa thành công'
    });

  } catch (error) {
    console.error('Delete checklist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi xóa nhiệm vụ'
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
        message: 'Không tìm thấy người dùng'
      });
    }

    const currentChecklist = user.checklistData || [];
    const itemIndex = currentChecklist.findIndex(item => item.id === parseInt(itemId));

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhiệm vụ'
      });
    }

    // Toggle completion status
    currentChecklist[itemIndex].completed = !currentChecklist[itemIndex].completed;
    
    user.checklistData = currentChecklist;
    await user.save();

    res.status(200).json({
      success: true,
      data: currentChecklist[itemIndex],
      message: 'Nhiệm vụ đã được chuyển đổi trạng thái thành công'
    });

  } catch (error) {
    console.error('Toggle checklist item error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi chuyển đổi trạng thái nhiệm vụ'
    });
  }
};