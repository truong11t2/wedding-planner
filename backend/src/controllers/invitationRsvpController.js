const Invitation = require('../models/Invitation');
const InvitationRsvp = require('../models/InvitationRsvp');

async function findPublishedInvitation(invitationId) {
  return Invitation.findOne({ where: { id: invitationId, isPublished: true } });
}

exports.createRsvp = async (req, res) => {
  try {
    const invitation = await findPublishedInvitation(req.params.invitationId);
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
    const attendanceStatus = req.body.attendanceStatus;
    const mealPreference = typeof req.body.mealPreference === 'string'
      ? req.body.mealPreference.trim()
      : '';
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    const guestCount = Number(req.body.guestCount);

    if (!name || !['attending', 'declined'].includes(attendanceStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Name and a valid attendance status are required'
      });
    }
    if (name.length > 120 || phone.length > 40 || mealPreference.length > 40 || message.length > 1000) {
      return res.status(400).json({ success: false, message: 'RSVP data is too long' });
    }
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
      return res.status(400).json({ success: false, message: 'Guest count must be between 1 and 10' });
    }

    const rsvp = await InvitationRsvp.create({
      invitationId: invitation.id,
      name,
      phone,
      attendanceStatus,
      guestCount,
      mealPreference,
      message
    });

    return res.status(201).json({
      success: true,
      message: 'RSVP submitted successfully',
      rsvp: {
        id: rsvp.id,
        name: rsvp.name,
        attendanceStatus: rsvp.attendanceStatus,
        guestCount: rsvp.guestCount,
        mealPreference: rsvp.mealPreference,
        message: rsvp.message,
        createdAt: rsvp.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating invitation RSVP:', error);
    return res.status(500).json({ success: false, message: 'Error creating RSVP' });
  }
};

exports.getMyRsvps = async (req, res) => {
  try {
    const invitation = await Invitation.findOne({ where: { userId: req.user.id } });
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    const rsvps = await InvitationRsvp.findAll({
      where: { invitationId: invitation.id },
      attributes: ['id', 'name', 'phone', 'attendanceStatus', 'guestCount', 'mealPreference', 'message', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ success: true, rsvps });
  } catch (error) {
    console.error('Error fetching invitation RSVPs:', error);
    return res.status(500).json({ success: false, message: 'Error fetching RSVPs' });
  }
};