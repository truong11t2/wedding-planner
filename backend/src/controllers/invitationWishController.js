const Invitation = require('../models/Invitation');
const InvitationWish = require('../models/InvitationWish');

async function findPublishedInvitation(invitationId) {
  return Invitation.findOne({ where: { id: invitationId, isPublished: true } });
}

exports.getWishes = async (req, res) => {
  try {
    const invitation = await findPublishedInvitation(req.params.invitationId);
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    const wishes = await InvitationWish.findAll({
      where: { invitationId: invitation.id, isApproved: true },
      attributes: ['id', 'name', 'message', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ success: true, wishes });
  } catch (error) {
    console.error('Error fetching invitation wishes:', error);
    return res.status(500).json({ success: false, message: 'Error fetching invitation wishes' });
  }
};

exports.createWish = async (req, res) => {
  try {
    const invitation = await findPublishedInvitation(req.params.invitationId);
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required' });
    }
    if (name.length > 120 || message.length > 2000) {
      return res.status(400).json({ success: false, message: 'Name or message is too long' });
    }

    const wish = await InvitationWish.create({
      invitationId: invitation.id,
      name,
      message
    });

    return res.status(201).json({
      success: true,
      wish: { id: wish.id, name: wish.name, message: wish.message, createdAt: wish.createdAt }
    });
  } catch (error) {
    console.error('Error creating invitation wish:', error);
    return res.status(500).json({ success: false, message: 'Error creating invitation wish' });
  }
};