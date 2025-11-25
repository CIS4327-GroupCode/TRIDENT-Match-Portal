'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('milestones', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'project_ideas',
          key: 'project_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });

    // Add indexes
    await queryInterface.addIndex('milestones', ['project_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('milestones');
  }
};
