"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("product-variants", [
      {
        name: "Apple Premium",
        code: "VRNT000001",
        price: 50000,
        qty: 20,
        image_location: null,
        product_id: 1,
        created_user_id: 1,
        updated_user_id: 1,
      },
      {
        name: "Candy Premium",
        code: "VRNT000002",
        price: 8000,
        qty: 10,
        image_location: null,
        product_id: 2,
        created_user_id: 1,
        updated_user_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("product-variants", null);
  },
};
