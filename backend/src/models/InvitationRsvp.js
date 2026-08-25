const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvitationRsvp = sequelize.define('InvitationRsvp', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  invitationId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  attendanceStatus: {
    type: DataTypes.ENUM('attending', 'declined'),
    allowNull: false
  },
  guestCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  mealPreference: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  message: {
    type: DataTypes.STRING(1000),
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'InvitationRsvps'
});

InvitationRsvp.associate = function (models) {
  InvitationRsvp.belongsTo(models.Invitation, {
    foreignKey: 'invitationId',
    as: 'invitation',
    onDelete: 'CASCADE'
  });
};

module.exports = InvitationRsvp;