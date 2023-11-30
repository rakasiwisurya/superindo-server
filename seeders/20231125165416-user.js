"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        username: "admin1",
        password: "$2b$10$CRgMxvO/cq8KFduWDIyWreOVDFkLjWakWqbq8PB.VkweUmEvYwSme", // admin123
        role: "ADMINISTRATOR",
      },
      {
        username: "user1",
        password: "$2b$10$jk1/WVYoHRLvJLPVnRahW.UjKGB31kDsBVHd6OR/j371gzgjKvSxq", // user123
        role: "CUSTOMER",
      },
      {
        username: "admin1",
        password: "$2b$10$CRgMxvO/cq8KFduWDIyWreOVDFkLjWakWqbq8PB.VkweUmEvYwSme", // admin123
        role: "ADMINISTRATOR",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null);
  },
};
