const { Timeline, TimelineItem, TimelineOption, User } = require('../models');
const { Op } = require('sequelize');

// Helper function to find or create timeline (ONLY the timeline container)
const findOrCreateTimeline = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const [timeline, created] = await Timeline.findOrCreate({
    where: { userId },
    defaults: {
      userId,
      weddingDate: user.weddingDate || new Date(),
      isGenerated: false
    }
  });

  if (created) {
    console.log(`✅ Created new timeline for user ${userId}`);
  }

  return timeline;
};

// Save or update individual timeline item (FIXED)
exports.saveTimelineItem = async (req, res) => {
  try {
    const { itemId, title, description, dueDate, category, selectedOption, selectedOptions, isWeddingDay } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!itemId || !title || !description || !dueDate || !category) {
      return res.status(400).json({
        success: false,
        message: 'ItemId, title, description, dueDate, and category are required'
      });
    }

    // Find or create the timeline container first
    const timeline = await findOrCreateTimeline(userId);

    // Find or create the timeline ITEM (not timeline itself)
    const [timelineItem, created] = await TimelineItem.findOrCreate({
      where: {
        timelineId: timeline.id,  // ✅ Correct: link to timeline
        itemId                    // ✅ Correct: itemId belongs to TimelineItem
      },
      defaults: {
        timelineId: timeline.id,
        itemId,
        title,
        description,
        dueDate: new Date(dueDate),
        category,
        isWeddingDay: isWeddingDay || false,
        completed: !!(selectedOption || selectedOptions)
      }
    });

    // If item exists, update it
    if (!created) {
      await timelineItem.update({
        title,
        description,
        dueDate: new Date(dueDate),
        category,
        isWeddingDay: isWeddingDay || false,
        completed: !!(selectedOption || selectedOptions)
      });
    }

    res.json({
      success: true,
      message: created ? 'Timeline item created successfully' : 'Timeline item updated successfully',
      data: timelineItem
    });

  } catch (error) {
    console.error('Error saving timeline item:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving timeline item',
      error: error.message
    });
  }
};

// Save timeline option selection (FIXED)
exports.saveTimelineSelection = async (req, res) => {
  try {
    const { itemId, itemTitle, itemCategory, itemDescription, optionId, optionLabel, optionDescription, optionPrice, optionImage, optionRating } = req.body;
    const userId = req.user.id;

    if (!itemId || !itemTitle || !itemCategory || !itemDescription || !optionId || !optionLabel) {
      return res.status(400).json({
        success: false,
        message: 'Item ID, Item Title, Item Category, Item Description, Option ID, and Option Label are required'
      });
    }

    // Find or create timeline container
    const timeline = await findOrCreateTimeline(userId);

    // Find the timeline item
    let timelineItem = await TimelineItem.findOne({
      where: {
        timelineId: timeline.id,
        itemId: itemId
      }
    });

    if (!timelineItem) {
      // Create the timeline item if it doesn't exist
      timelineItem = await TimelineItem.create({
        timelineId: timeline.id,
        itemId: itemId,
        category: itemCategory,
        title: itemTitle,
        description: itemDescription,
      });
    }

    // Find or create the option
    let option = await TimelineOption.findOne({
      where: {
        timelineItemId: timelineItem.id,
        optionId
      }
    });

    if (!option) {
      // Create the option if it doesn't exist
      option = await TimelineOption.create({
        timelineItemId: timelineItem.id,
        optionId: optionId,
        label: optionLabel,
        description: optionDescription,
        price: optionPrice,
        image: optionImage,
        rating: optionRating,
        isSelected: true
      });
    } else {
      // Update option metadata if it exists
      await option.update({
        optionId: optionId,
        label: optionLabel,
        description: optionDescription,
        price: optionPrice,
        image: optionImage,
        rating: optionRating,
      });
    }

    res.json({
      success: true,
      message: 'Selection saved successfully',
      data: option
    });

  } catch (error) {
    console.error('Error saving timeline selection:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving selection',
      error: error.message
    });
  }
};

// Save multiple text inputs (FIXED)
exports.saveTimelineTextInputs = async (req, res) => {
  try {
    const { itemId, itemTitle, itemDescription, itemCategory, optionTextInputs } = req.body;
    const userId = req.user.id;

    if (!itemId || !itemTitle || !itemDescription || !itemCategory || !optionTextInputs || typeof optionTextInputs !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Item ID, Item Title, Item Description, Item Category, and Option Text Inputs are required'
      });
    }

    // Find or create timeline container
    const timeline = await findOrCreateTimeline(userId);

    // Find the timeline item
    let timelineItem = await TimelineItem.findOne({
      where: {
        timelineId: timeline.id,
        itemId
      }
    });

    if (!timelineItem) {
      // Create the timeline item if it doesn't exist
      timelineItem = await TimelineItem.create({
        timelineId: timeline.id,
        itemId: itemId,
        title: itemTitle,
        category: itemCategory,
        description: itemDescription,
      });
    }

    // Convert optionTextInputs to string
    let textInputString = '';
    if (typeof optionTextInputs === 'object' && optionTextInputs !== null) {
      // If it's an object, convert to JSON string
      textInputString = JSON.stringify(optionTextInputs);
    } else if (typeof optionTextInputs === 'string') {
      // If it's already a string, use as is
      textInputString = optionTextInputs;
    } else {
      // For other types, convert to string
      textInputString = String(optionTextInputs);
    }

    // Find or create the text input option
    let option = await TimelineOption.findOne({
      where: {
        timelineItemId: timelineItem.id
      }
    });

    if (!option) {
      option = await TimelineOption.create({
        timelineItemId: timelineItem.id,
        textValue: textInputString,
        isTextInput: true
      });
    } else {
      await option.update({
        textValue: textInputString
      });
    }

    res.json({
      success: true,
      message: 'Text inputs saved successfully',
      data: textInputString
    });
  } catch (error) {
    console.error('Error saving text inputs:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving text inputs',
      error: error.message
    });
  }
};

// Get user's timeline (FIXED)
exports.getUserTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find or create timeline container
    const timeline = await findOrCreateTimeline(userId);

    // Get timeline with all items and options
    const timelineWithData = await Timeline.findOne({
      where: { userId },
      include: [{
        model: TimelineItem,
        as: 'items',
        include: [{
          model: TimelineOption,
          as: 'options',
          required: false
        }],
        required: false
      }]
    });

    if (!timelineWithData || !timelineWithData.items || timelineWithData.items.length === 0) {
      return res.json({
        success: true,
        data: {
          id: timeline.id,
          userId: timeline.userId,
          weddingDate: timeline.weddingDate,
          isGenerated: timeline.isGenerated,
          items: []
        },
        message: 'Timeline found but no items. Please generate your timeline first.'
      });
    }

    // Transform data for frontend
    const transformedTimeline = {
      ...timelineWithData.toJSON(),
      items: timelineWithData.items.map(item => ({
        ...item.toJSON(),
        selectedOption: item.options.find(opt => opt.isSelected && !opt.isTextInput)?.optionId,
        selectedOptions: item.options
          .filter(opt => opt.isTextInput && opt.textValue)
          .reduce((acc, opt) => {
            acc[opt.optionId] = opt.textValue;
            return acc;
          }, {})
      }))
    };

    res.json({
      success: true,
      data: transformedTimeline
    });

  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching timeline',
      error: error.message
    });
  }
};

// Clear user's timeline (FIXED)
exports.clearUserTimeline = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find timeline
    const timeline = await Timeline.findOne({
      where: { userId }
    });

    if (!timeline) {
      return res.json({
        success: true,
        message: 'No timeline found to clear'
      });
    }

    // Delete all timeline items (cascade will handle options)
    const deletedItemsCount = await TimelineItem.destroy({
      where: { timelineId: timeline.id }
    });

    // Update timeline to not generated
    await timeline.update({
      isGenerated: false
    });

    // Update user flag
    await User.update(
      { hasGeneratedTimeline: false },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: `Timeline cleared successfully. ${deletedItemsCount} items removed.`
    });

  } catch (error) {
    console.error('Error clearing timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing timeline',
      error: error.message
    });
  }
};

// Delete specific timeline item (FIXED)
exports.deleteTimelineItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    // Find timeline
    const timeline = await Timeline.findOne({
      where: { userId }
    });

    if (!timeline) {
      return res.status(404).json({
        success: false,
        message: 'Timeline not found'
      });
    }

    // Delete timeline item (not timeline itself)
    const deleted = await TimelineItem.destroy({
      where: {
        timelineId: timeline.id,
        itemId
      }
    });

    if (deleted) {
      res.json({
        success: true,
        message: 'Timeline item deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Timeline item not found'
      });
    }

  } catch (error) {
    console.error('Error deleting timeline item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting timeline item',
      error: error.message
    });
  }
};

// Save complete timeline with items and options
exports.saveCompleteTimeline = async (req, res) => {
  try {
    const { timeline: timelineData, weddingDate } = req.body;
    const userId = req.user.id;

    if (!timelineData || !Array.isArray(timelineData) || !weddingDate) {
      return res.status(400).json({
        success: false,
        message: 'Timeline data and wedding date are required'
      });
    }

    // Create or update timeline
    const [timeline, timelineCreated] = await Timeline.findOrCreate({
      where: { userId },
      defaults: {
        userId,
        weddingDate: new Date(weddingDate),
        isGenerated: true
      }
    });

    if (!timelineCreated) {
      await timeline.update({
        weddingDate: new Date(weddingDate),
        isGenerated: true
      });
    }

    const savedItems = [];

    for (const itemData of timelineData) {
      // Create or update timeline item
      const [timelineItem, itemCreated] = await TimelineItem.findOrCreate({
        where: {
          timelineId: timeline.id,
          itemId: itemData.id
        },
        defaults: {
          timelineId: timeline.id,
          itemId: itemData.id,
          title: itemData.title,
          description: itemData.description,
          dueDate: new Date(itemData.dueDate),
          category: itemData.category,
          isWeddingDay: itemData.isWeddingDay || false
        }
      });

      // Update timeline item if it exists
      if (!itemCreated) {
        await timelineItem.update({
          title: itemData.title,
          description: itemData.description,
          dueDate: new Date(itemData.dueDate),
          category: itemData.category,
          isWeddingDay: itemData.isWeddingDay || false
        });
      }

      // Save options if they exist
      if (itemData.options && Array.isArray(itemData.options)) {
        for (const option of itemData.options) {
          const [timelineOption, optionCreated] = await TimelineOption.findOrCreate({
            where: {
              timelineItemId: timelineItem.id,
              optionId: option.id
            },
            defaults: {
              timelineItemId: timelineItem.id,
              optionId: option.id,
              label: option.label,
              description: option.description,
              price: option.price,
              image: option.image,
              location: option.location,
              specialties: option.specialties,
              rating: option.rating,
              isTextInput: option.isTextInput || false,
              isSelected: false, // Default to not selected
              textValue: null // Default to null
            }
          });

          // If option already exists, preserve user data but update metadata
          if (!optionCreated) {
            await timelineOption.update({
              label: option.label,
              description: option.description,
              price: option.price,
              image: option.image,
              location: option.location,
              specialties: option.specialties,
              rating: option.rating,
              isTextInput: option.isTextInput || false
              // Don't update isSelected or textValue to preserve user choices
            });
          }
        }
      }

      // If user has existing selections, apply them
      if (itemData.selectedOption) {
        await TimelineOption.update(
          { isSelected: false },
          {
            where: {
              timelineItemId: timelineItem.id,
              isTextInput: false
            }
          }
        );

        await TimelineOption.update(
          { isSelected: true },
          {
            where: {
              timelineItemId: timelineItem.id,
              optionId: itemData.selectedOption,
              isTextInput: false
            }
          }
        );
      }

      // If user has existing text inputs, apply them
      if (itemData.selectedOptions) {
        for (const [optionId, textValue] of Object.entries(itemData.selectedOptions)) {
          await TimelineOption.update(
            { 
              textValue,
              isSelected: !!(textValue && textValue.trim())
            },
            {
              where: {
                timelineItemId: timelineItem.id,
                optionId,
                isTextInput: true
              }
            }
          );
        }
      }

      savedItems.push(timelineItem);
    }

    // Update user's hasGeneratedTimeline flag
    await User.update(
      { hasGeneratedTimeline: true },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: 'Timeline saved successfully',
      data: { timeline, items: savedItems }
    });

  } catch (error) {
    console.error('Error saving complete timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving timeline',
      error: error.message
    });
  }
};