const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invitation = sequelize.define('Invitation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  templateId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  htmlFileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publicUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brideName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  groomName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  eventDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  config: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'Invitations'
});

Invitation.associate = function (models) {
  Invitation.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Invitation;
