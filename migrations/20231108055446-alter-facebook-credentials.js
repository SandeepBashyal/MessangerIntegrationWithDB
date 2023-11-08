"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      "provider_facebook_credentials",
      "page_id",
      {
        type: Sequelize.BIGINT,
        allowNull: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      "provider_facebook_credentials",
      "page_id"
    );
  },
};
