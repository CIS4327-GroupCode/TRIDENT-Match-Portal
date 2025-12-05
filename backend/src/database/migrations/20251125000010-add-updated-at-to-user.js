'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add updated_at column to _user table
    await queryInterface.addColumn('_user', 'updated_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('_user', 'updated_at');
  }
};
