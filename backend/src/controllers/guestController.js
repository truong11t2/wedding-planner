const User = require('../models/User');

// Get user's guest list
exports.getGuestList = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return guest data or default empty array
    const guestData = user.guestData || [];

    res.status(200).json({
      success: true,
      data: guestData,
      message: 'Guest list retrieved successfully'
    });

  } catch (error) {
    console.error('Get guest list error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving guest list'
    });
  }
};

// Save user's entire guest list
exports.saveGuestList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { guests } = req.body;

    // Validate guests array
    if (!Array.isArray(guests)) {
      return res.status(400).json({
        success: false,
        message: 'Guests must be an array'
      });
    }

    // Validate each guest item structure
    const isValidGuest = (guest) => {
      return (
        guest &&
        typeof guest.id === 'string' &&
        typeof guest.name === 'string' &&
        ['bride', 'groom'].includes(guest.side) &&
        ['pending', 'attending', 'declined', 'no-response'].includes(guest.rsvpStatus) &&
        typeof guest.plusOne === 'boolean' &&
        guest.createdAt
      );
    };

    const invalidGuests = guests.filter(guest => !isValidGuest(guest));
    if (invalidGuests.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid guest item format',
        invalidGuests
      });
    }

    // Update user's guest list
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.guestData = guests;
    await user.save();

    res.status(200).json({
      success: true,
      data: user.guestData,
      message: 'Guest list saved successfully'
    });

  } catch (error) {
    console.error('Save guest list error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving guest list'
    });
  }
};

// Add a single guest
exports.addGuest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      name, 
      email, 
      phone, 
      address, 
      side, 
      rsvpStatus, 
      plusOne, 
      plusOneName, 
      dietaryRestrictions, 
      notes 
    } = req.body;

    // Validate required fields
    if (!name || !side) {
      return res.status(400).json({
        success: false,
        message: 'Name and side are required'
      });
    }

    if (!['bride', 'groom'].includes(side)) {
      return res.status(400).json({
        success: false,
        message: 'Side must be bride or groom'
      });
    }

    if (!['pending', 'attending', 'declined', 'no-response'].includes(rsvpStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid RSVP status'
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get existing guest list or initialize empty array
    const currentGuestList = user.guestData || [];
    
    // Generate simple sequential ID
    const existingIds = currentGuestList.map(guest => {
      const idNum = parseInt(guest.id);
      return isNaN(idNum) ? 0 : idNum;
    });
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    // Create new guest
    const newGuest = {
      id: newId.toString(),
      name: name.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      address: address?.trim() || '',
      side,
      rsvpStatus: rsvpStatus || 'pending',
      plusOne: Boolean(plusOne),
      plusOneName: plusOneName?.trim() || '',
      dietaryRestrictions: dietaryRestrictions?.trim() || '',
      notes: notes?.trim() || '',
      createdAt: new Date().toISOString()
    };

    // Add to guest list
    const updatedGuestList = [...currentGuestList, newGuest];
    user.guestData = updatedGuestList;
    await user.save();

    res.status(201).json({
      success: true,
      data: newGuest,
      message: 'Guest added successfully'
    });

  } catch (error) {
    console.error('Add guest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding guest'
    });
  }
};

// Update a guest
exports.updateGuest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { guestId } = req.params;
    const updates = req.body;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentGuestList = user.guestData || [];
    const guestIndex = currentGuestList.findIndex(guest => guest.id === guestId);

    if (guestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // Validate updates if provided
    if (updates.side && !['bride', 'groom'].includes(updates.side)) {
      return res.status(400).json({
        success: false,
        message: 'Side must be bride or groom'
      });
    }

    if (updates.rsvpStatus && !['pending', 'attending', 'declined', 'no-response'].includes(updates.rsvpStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid RSVP status'
      });
    }

    // Update the guest
    const updatedGuest = { 
      ...currentGuestList[guestIndex], 
      ...updates,
      // Ensure we don't change the ID or createdAt
      id: currentGuestList[guestIndex].id,
      createdAt: currentGuestList[guestIndex].createdAt
    };
    
    currentGuestList[guestIndex] = updatedGuest;
    
    user.guestData = currentGuestList;
    await user.save();

    res.status(200).json({
      success: true,
      data: updatedGuest,
      message: 'Guest updated successfully'
    });

  } catch (error) {
    console.error('Update guest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating guest'
    });
  }
};

// Delete a guest
exports.deleteGuest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { guestId } = req.params;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentGuestList = user.guestData || [];
    const guestIndex = currentGuestList.findIndex(guest => guest.id === guestId);

    if (guestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // Remove the guest
    const deletedGuest = currentGuestList.splice(guestIndex, 1)[0];
    
    user.guestData = currentGuestList;
    await user.save();

    res.status(200).json({
      success: true,
      data: deletedGuest,
      message: 'Guest deleted successfully'
    });

  } catch (error) {
    console.error('Delete guest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting guest'
    });
  }
};

// Update guest RSVP status
exports.updateRSVP = async (req, res) => {
  try {
    const userId = req.user.id;
    const { guestId } = req.params;
    const { rsvpStatus } = req.body;

    if (!['pending', 'attending', 'declined', 'no-response'].includes(rsvpStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid RSVP status'
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentGuestList = user.guestData || [];
    const guestIndex = currentGuestList.findIndex(guest => guest.id === guestId);

    if (guestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    // Update RSVP status
    currentGuestList[guestIndex].rsvpStatus = rsvpStatus;
    
    user.guestData = currentGuestList;
    await user.save();

    res.status(200).json({
      success: true,
      data: currentGuestList[guestIndex],
      message: 'RSVP status updated successfully'
    });

  } catch (error) {
    console.error('Update RSVP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating RSVP'
    });
  }
};

// Get guest statistics
exports.getGuestStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const guestData = user.guestData || [];
    
    const stats = {
      total: guestData.length,
      bride: {
        total: guestData.filter(g => g.side === 'bride').length,
        attending: guestData.filter(g => g.side === 'bride' && g.rsvpStatus === 'attending').length,
        declined: guestData.filter(g => g.side === 'bride' && g.rsvpStatus === 'declined').length,
        pending: guestData.filter(g => g.side === 'bride' && g.rsvpStatus === 'pending').length,
        plusOnes: guestData.filter(g => g.side === 'bride' && g.plusOne && g.rsvpStatus === 'attending').length
      },
      groom: {
        total: guestData.filter(g => g.side === 'groom').length,
        attending: guestData.filter(g => g.side === 'groom' && g.rsvpStatus === 'attending').length,
        declined: guestData.filter(g => g.side === 'groom' && g.rsvpStatus === 'declined').length,
        pending: guestData.filter(g => g.side === 'groom' && g.rsvpStatus === 'pending').length,
        plusOnes: guestData.filter(g => g.side === 'groom' && g.plusOne && g.rsvpStatus === 'attending').length
      },
      overall: {
        attending: guestData.filter(g => g.rsvpStatus === 'attending').length,
        declined: guestData.filter(g => g.rsvpStatus === 'declined').length,
        pending: guestData.filter(g => g.rsvpStatus === 'pending').length,
        totalPlusOnes: guestData.filter(g => g.plusOne && g.rsvpStatus === 'attending').length
      }
    };

    stats.overall.expectedAttendees = stats.overall.attending + stats.overall.totalPlusOnes;

    res.status(200).json({
      success: true,
      data: stats,
      message: 'Guest statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Get guest stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving guest statistics'
    });
  }
};