'use strict';

module.exports = (sequelize, DataTypes) => {
  const Interventions = sequelize.define('Interventions', {
    userId: DataTypes.BIGINT,
    date_time_intervention: DataTypes.DATE,
    observation: DataTypes.STRING
  }, 
  {
    timestamps: false
  });
  Interventions.associate = (models) => {
    Interventions.belongsTo(models.Users, {foreignKey: 'id'})
  };

  return Interventions;
};