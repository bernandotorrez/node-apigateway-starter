'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  User.init({
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    level: DataTypes.ENUM('Admin', 'User')
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] }
      }
    }
  });
  return User;
};
