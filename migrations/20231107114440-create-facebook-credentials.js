"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("provider_facebook_credentials", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      app_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      app_secret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      webhook_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verify_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      long_lived_access_token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      page_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      page_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      page_access_token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("provider_facebook_credentials");
  },
};
