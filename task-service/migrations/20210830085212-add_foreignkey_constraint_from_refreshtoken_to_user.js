'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // Foreign Key
    await queryInterface.addConstraint('refresh_tokens', {
      type: 'foreign key',
      name: 'REFRESH_TOKEN__USER_ID',
      fields: ['username'],
      references: {
        table: 'users',
        field: 'username'
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeConstraint('refresh_tokens', 'REFRESH_TOKEN__USER_ID')
  }
};
