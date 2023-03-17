'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      username: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(100)
      },
      password: {
        type: Sequelize.STRING(100)
      },
      level: {
        type: Sequelize.ENUM('Admin', 'User'),
        defaultValue: 'User'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};