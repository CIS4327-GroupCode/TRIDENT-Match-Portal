const { DataTypes, Model } = require('sequelize');
const sequelize = require('../index');

class Organization extends Model {
  // Instance methods
  toSafeObject() {
    const { ...safeOrg } = this.toJSON();
    return safeOrg;
  }
}

Organization.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    EIN: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'EIN'
    },
    mission: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    focus_tags: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'focus_tags'
    },
    compliance_flags: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'compliance_flags'
    },
    contacts: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Organization',
    tableName: 'organizations',
    timestamps: false,
    underscored: true
  }
);

module.exports = Organization;