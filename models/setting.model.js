const sequelize = require("./connection");
const { DataTypes } = require("sequelize");

const Settings = sequelize.define("Settings", {
  fee_order: {
    type: DataTypes.FLOAT,
  },
  payments: {
    type: DataTypes.JSON,
  },
});
module.exports = Settings;
