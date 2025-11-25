const { DataTypes, Model } = require('sequelize');
const sequelize = require('../index');

class Milestone extends Model {
  // Instance methods
  toSafeObject() {
    const { ...safeMilestone } = this.toJSON();
    return safeMilestone;
  }
}

Milestone.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'due_date'
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'project_ideas',
        key: 'project_id'
      },
      field: 'project_id'
    }
  },
  {
    sequelize,
    modelName: 'Milestone',
    tableName: 'milestones',
    timestamps: false,
    underscored: true
  }
);

module.exports = Milestone;
