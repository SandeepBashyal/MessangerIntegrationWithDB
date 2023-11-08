const Sequelize = require("sequelize");
const database = require("../config/instance");
const { FacebookCredentials } = require("./facebookCredentials");
const sequelize = database.sequelize;

const Customer = sequelize.define(
  "provider_customer",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    psid: {
      type: Sequelize.TEXT,
      primaryKey: true,
      allowNull: false,
    },
    conversation_id: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    facebookCredentialsId: {
      // Corrected field name
      type: Sequelize.INTEGER,
      references: {
        model: "provider_facebook_credentials", // Ensure the model name is correct
        key: "id",
      },
      field: "facebook_credintials_id", // Corrected field name
    },
  },
  {
    timestamps: false,
    paranoid: true,
    freezeTableName: true,
    underscored: true,
  }
);

FacebookCredentials.hasMany(Customer, {
  foreignKey: "facebookCredentialsId", // Corrected foreign key field name
  as: "customers",
});
Customer.belongsTo(FacebookCredentials, {
  foreignKey: "facebookCredentialsId",
  as: "facebookCredentials",
});

module.exports = {
  Customer,
};
