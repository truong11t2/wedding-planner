const User = require('./User');
const Timeline = require('./Timeline');
const TimelineItem = require('./TimelineItem');
const TimelineOption = require('./TimelineOption');

// Define associations
User.hasOne(Timeline, {
  foreignKey: 'userId',
  as: 'timeline',
  onDelete: 'CASCADE'
});

Timeline.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Timeline.hasMany(TimelineItem, {
  foreignKey: 'timelineId',
  as: 'items',
  onDelete: 'CASCADE'
});

TimelineItem.belongsTo(Timeline, {
  foreignKey: 'timelineId',
  as: 'timeline'
});

TimelineItem.hasMany(TimelineOption, {
  foreignKey: 'timelineItemId',
  as: 'options',
  onDelete: 'CASCADE'
});

TimelineOption.belongsTo(TimelineItem, {
  foreignKey: 'timelineItemId',
  as: 'timelineItem'
});

module.exports = {
  User,
  Timeline,
  TimelineItem,
  TimelineOption
};