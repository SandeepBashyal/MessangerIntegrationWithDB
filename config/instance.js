const sequelize = require("sequelize");
const { db } = require(".");

class Database {
  static instance;
  sequelize;
  constructor() {
    this.dialect = db.dialect;
    this.dbname = db.name;
    this.username = db.username;
    this.password = db.password;
    this.host = db.host;
    this.port = db.port;
    this.maxPool = 10;
    this.minPool = 1;
    this.sequelize = new sequelize.Sequelize(
      this.dbname,
      this.username,
      this.password,
      {
        host: this.host,
        dialect: this.dialect,
        dialectOptions: {
          encrypt: true,
        },
        port: this.port,
        logging: false,
        timezone: "utc",
        pool: {
          max: this.maxPool,
          min: this.minPool,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          timestamps: true,
          createdAt: true,
          updatedAt: true,
        },
      }
    );
  }

  static get() {
    if (!Database.instance) {
      console.info(Database.instance);
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connection() {
    try {
      await this.sequelize.authenticate();
      console.info(`${db.dialect} database connected`);
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }
}

const database = new Database();

module.exports = database;
