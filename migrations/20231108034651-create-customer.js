"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("provider_customer", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      psid: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      conversation_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      facebook_credintials_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "provider_facebook_credentials",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("provider_customer");
  },
};
