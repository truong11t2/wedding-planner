const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  coupleNames: {
    type: DataTypes.STRING,
    allowNull: false
  },
  albumTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weddingDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  htmlFileName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  publicUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photos: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'Albums'
});

// Define association - will be used after User model is loaded
Album.associate = function(models) {
  Album.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Album;
