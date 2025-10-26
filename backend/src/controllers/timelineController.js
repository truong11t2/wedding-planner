const User = require('../models/User');

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

    // Prepare timeline data
    const timelineData = {
      weddingDate: weddingDate,
      timelineItems: timelineItems,
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
      attributes: ['id', 'fullName', 'email', 'weddingDate', 'timelineData', 'hasGeneratedTimeline', 'updatedAt'],
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
      attributes: ['id', 'fullName', 'email', 'weddingDate', 'hasGeneratedTimeline', 'updatedAt'],
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
  saveTimeline,
  loadTimeline,
  deleteTimeline,
  getTimelineStatus,
};