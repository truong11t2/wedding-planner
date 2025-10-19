const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimelineOption = sequelize.define('TimelineOption', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  timelineItemId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'timeline_items',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  optionId: {
    type: DataTypes.STRING,
    allowNull: true // e.g., 'budget', 'medium', 'luxury'
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true // e.g., 'Budget Friendly'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  specialties: {
    type: DataTypes.JSON,
    allowNull: true // Array of strings
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true
  },
  isTextInput: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isSelected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  textValue: {
    type: DataTypes.TEXT,
    allowNull: true // For text input options
  }
}, {
  timestamps: true,
  tableName: 'timeline_options',
  indexes: [
    {
      unique: true,
      fields: ['timelineItemId', 'optionId'] // Each timeline item can have unique options
    }
  ]
});

TimelineOption.associate = function(models) {
  TimelineOption.belongsTo(models.TimelineItem, {
    foreignKey: 'timelineItemId',
    as: 'timelineItem'
  });
};

module.exports = TimelineOption;