const Sequelize = require("sequelize");
const database = require("../config/instance");

const sequelize = database.sequelize;

const FacebookCredentials = sequelize.define(
  "provider_facebook_credentials",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    app_id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    app_secret: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    webhook_enabled: {
      type: Sequelize.BOOLEAN,
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
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "provider_facebook_credentials",
    underscored: true,
  }
);
module.exports = {
  FacebookCredentials,
};
