"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: { type: Sequelize.ENUM("income", "expense"), allowNull: false },
      category: { type: Sequelize.STRING(50), allowNull: false },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      notes: { type: Sequelize.STRING(255) },
      date: { type: Sequelize.DATEONLY, defaultValue: Sequelize.NOW },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("transactions");
  },
};
