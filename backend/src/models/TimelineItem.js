const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimelineItem = sequelize.define('TimelineItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  timelineId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'timelines',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false // e.g., 'set-budget', 'book-photographer', 'book-venue'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false // 'Vendor', 'Yourself', 'Attire', etc.
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isWeddingDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'timeline_items',
  indexes: [
    {
      unique: true,
      fields: ['timelineId', 'itemId'] // Each timeline can have one entry per item
    }
  ]
});

TimelineItem.associate = function(models) {
  TimelineItem.belongsTo(models.Timeline, {
    foreignKey: 'timelineId',
    as: 'timeline'
  });
  
  TimelineItem.hasMany(models.TimelineOption, {
    foreignKey: 'timelineItemId',
    as: 'options',
    onDelete: 'CASCADE'
  });
};

module.exports = TimelineItem;