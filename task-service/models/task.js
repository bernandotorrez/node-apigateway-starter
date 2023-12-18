'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Task.init({
    task: DataTypes.STRING,
    status: DataTypes.ENUM('0', '1'),
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });
  return Task;
};