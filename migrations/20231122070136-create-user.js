"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING(30),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      role: {
        allowNull: false,
        defaultValue: "CUSTOMER",
        type: Sequelize.ENUM("ADMINISTRATOR", "CUSTOMER"),
      },
      created_date: {
        allowNull: false,
        defaultValue: Sequelize.literal("now()"),
        type: Sequelize.DATE,
      },
      updated_date: {
        allowNull: false,
        defaultValue: Sequelize.literal("now()"),
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
