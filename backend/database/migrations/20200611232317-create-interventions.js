"use strict";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable("Interventions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      userId: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {         // user hasmany user_phase 1:n
          model: 'Users',
          key: 'id'
        }
      },
      date_time_intervention: {
        allowNull: false,
        type: DataTypes.DATE
      },
      observation: {
        allowNull: true,
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'Interventions',
      timestamps: false
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("Interventions");
  }
};
