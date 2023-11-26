"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("products", [
      {
        plu: "PDCT000001",
        name: "Apple1",
        product_category_id: 1,
        created_user_id: 1,
        updated_user_id: 1,
      },
      {
        plu: "PDCT000002",
        name: "Candy1",
        product_category_id: 2,
        created_user_id: 1,
        updated_user_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null);
  },
};
