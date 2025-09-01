// src/models/Tag.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Tag = sequelize.define('Tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  }
}, {
  timestamps: true,
  tableName: 'tags'
});

export default Tag;