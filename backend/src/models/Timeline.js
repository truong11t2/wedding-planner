const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Timeline = sequelize.define('Timeline', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true, // Each user has only one timeline
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  weddingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  isGenerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'timelines'
});

Timeline.associate = function(models) {
  Timeline.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  Timeline.hasMany(models.TimelineItem, {
    foreignKey: 'timelineId',
    as: 'items',
    onDelete: 'CASCADE'
  });
};

module.exports = Timeline;