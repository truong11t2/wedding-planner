const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvitationWish = sequelize.define('InvitationWish', {
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
  message: {
    type: DataTypes.STRING(2000),
    allowNull: false
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'InvitationWishes'
});

InvitationWish.associate = function (models) {
  InvitationWish.belongsTo(models.Invitation, {
    foreignKey: 'invitationId',
    as: 'invitation',
    onDelete: 'CASCADE'
  });
};

module.exports = InvitationWish;