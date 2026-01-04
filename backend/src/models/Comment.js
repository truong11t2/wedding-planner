const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  blogPostId: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Identifier for the blog post (slug)'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    comment: 'User ID if logged in, null for anonymous'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Auto-approve for now, can add moderation later
    comment: 'Whether comment is approved for display'
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'True if comment is from non-logged-in user'
  }
}, {
  timestamps: true,
  tableName: 'comments'
});

module.exports = Comment;