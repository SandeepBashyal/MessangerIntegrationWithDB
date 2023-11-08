const dotenv = require("dotenv");
const sequelize = require("sequelize");

const mustExist = (value, name) => {
  if (!value) {
    console.error(`Missing Config: ${name} !!!`);
    process.exit(1);
  }
  return value;
};

dotenv.config();

module.exports = {
  // port: mustExist(+process.env.PORT, "PORT"),
  // appName: mustExist(process.env.APP_NAME, "APP_NAME"),
  // playground: mustExist(process.env.GRAPHIQL === 'true', "GRAPHIQL"),
  // environment: process.env.ENVIRONMENT || EnvironmentEnum.DEVELOPMENT,

  db: {
    username: mustExist(process.env.DB_USER, "DB_USER"),
    password: mustExist(process.env.DB_PASSWORD, "DB_PASSWORD"),
    name: mustExist(process.env.DB_NAME, "DB_NAME"),
    host: mustExist(process.env.DB_HOST, "DB_HOST"),
    dialect: mustExist(process.env.DB_DIALECT, "DB_DIALECT"),
    port: mustExist(+process.env.DB_PORT, "DB_PORT"),
    logging: false,
    timezone: "utc",
  },

  corsWhitelist: [],

  pgMinLimit: 10,
  pgMaxLimit: 100,
  defaultCursor: "id",
  // defaultSort: SortEnum.DESC,

  // cognito: {
  //   userPoolId: mustExist(
  //     process.env.AWS_COGNITO_USER_POOL_ID,
  //     "AWS_COGNITO_USER_POOL_ID"
  //   ),
  //   clientId: mustExist(
  //     process.env.AWS_COGNITO_USER_POOL_CLIENT_ID,
  //     "AWS_COGNITO_USER_POOL_CLIENT_ID"
  //   ),
  //   region: mustExist(process.env.AWS_COGNITO_REGION, "AWS_COGNITO_REGION"),
  //   accessKeyId: mustExist(
  //     process.env.AWS_COGNITO_ACCESS_KEY_ID,
  //     "AWS_COGNITO_ACCESS_KEY_ID"
  //   ),
  //   secretAccessKey: mustExist(
  //     process.env.AWS_COGNITO_SECRET_ACCESS_KEY,
  //     "AWS_COGNITO_SECRET_ACCESS_KEY"
  //   ),
  // },
};

module.exports = Object.assign(module.exports, require("./instance"));
