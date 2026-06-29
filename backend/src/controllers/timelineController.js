const User = require('../models/User');

// @desc    Save wedding date
// @route   POST /api/auth/wedding-date
// @access  Private
const saveWeddingDate = async (req, res) => {
  try {
    const { weddingDate, location } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.weddingDate = weddingDate;
    if (location !== undefined) {
      user.location = location;
    }
    await user.save();

    res.json({
      success: true,
      message: 'Wedding date and location saved successfully',
      weddingDate: user.weddingDate,
      location: user.location
    });
  } catch (error) {
    console.error('Save wedding date error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Save timeline to user's profile
const saveTimeline = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weddingDate, timelineItems } = req.body;

    // Validate required fields
    if (!weddingDate || !timelineItems || !Array.isArray(timelineItems)) {
      return res.status(400).json({
        success: false,
        message: 'Wedding date and timeline items are required',
      });
    }

    // Validate wedding date format
    const weddingDateObj = new Date(weddingDate);
    if (isNaN(weddingDateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wedding date format',
      });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prepare minimal saved timeline state
    const savedTimelineItems = timelineItems.map((item) => {
      const savedItem = {
        id: item.id,
        completed: Boolean(item.completed),
      };

      if (item.selectedOption) {
        savedItem.selectedOption = item.selectedOption;
      }

      if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
        savedItem.selectedOptions = item.selectedOptions;
      }

      return savedItem;
    });

    const timelineData = {
      weddingDate: weddingDate,
      timelineItems: savedTimelineItems,
      savedAt: new Date().toISOString(),
    };

    // Update user with timeline data
    await user.update({
      weddingDate: weddingDateObj,
      timelineData: timelineData,
      hasGeneratedTimeline: true,
    });

    res.status(200).json({
      success: true,
      message: 'Timeline saved successfully',
      data: {
        weddingDate: user.weddingDate,
        timelineData: user.timelineData,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error saving timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while saving timeline',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Load timeline from user's profile
const loadTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user with timeline data
    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'weddingDate', 'timelineData', 'hasGeneratedTimeline', 'updatedAt'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user has timeline data
    if (!user.timelineData || !user.weddingDate) {
      return res.status(404).json({
        success: false,
        message: 'No timeline found for this user',
      });
    }

    res.status(200).json({
      success: true,
      userId: user.id,
      weddingDate: user.timelineData.weddingDate,
      timelineItems: user.timelineData.timelineItems || [],
      savedAt: user.timelineData.savedAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Error loading timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while loading timeline',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Add a selected vendor to an existing timeline item by setting selectedOption
const addSelectedVendor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vendorId, timelineId } = req.body;

    if (!vendorId || !timelineId) {
      return res.status(400).json({ success: false, message: 'Vendor ID and timeline ID are required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const timelineData = user.timelineData || {};
    const items = Array.isArray(timelineData.timelineItems) ? timelineData.timelineItems : [];

    const itemIndex = items.findIndex((item) => item.id === timelineId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Timeline item not found' });
    }

    items[itemIndex] = {
      ...items[itemIndex],
      selectedOption: vendorId,
    };

    timelineData.timelineItems = items;

    user.changed('timelineData', true); // Mark timelineData as changed to ensure Sequelize updates it
    
    await user.update({ timelineData: timelineData });

    return res.status(200).json({ success: true, message: 'Đã thêm nhà cung cấp' });
  } catch (error) {
    console.error('Lỗi khi thêm nhà cung cấp:', error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi thêm nhà cung cấp' });
  }
};

// Delete timeline from user's profile
const deleteTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user has timeline data
    if (!user.timelineData) {
      return res.status(404).json({
        success: false,
        message: 'No timeline found to delete',
      });
    }

    // Clear timeline data
    await user.update({
      weddingDate: null,
      timelineData: null,
      hasGeneratedTimeline: false,
    });

    res.status(200).json({
      success: true,
      message: 'Timeline deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting timeline',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get user profile with timeline status
const getTimelineStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'weddingDate', 'hasGeneratedTimeline', 'updatedAt'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        hasTimeline: user.hasGeneratedTimeline,
        weddingDate: user.weddingDate,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error getting timeline status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while getting timeline status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  saveWeddingDate,
  saveTimeline,
  loadTimeline,
  addSelectedVendor,
  deleteTimeline,
  getTimelineStatus,
};