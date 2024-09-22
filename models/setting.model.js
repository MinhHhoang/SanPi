const sequelize = require("./connection");
const { DataTypes } = require("sequelize");

const Settings = sequelize.define("Settings", {
  fee_order: {
    type: DataTypes.INTEGER,
  },
  momo_pay: {
    type: DataTypes.STRING,
  },
  banking1: {
    type: DataTypes.STRING,
  },
  banking2: {
    type: DataTypes.STRING,
  },
  icon_banking1: {
    type: DataTypes.STRING,
  },
  icon_banking2: {
    type: DataTypes.STRING,
  },
  icon_momo: {
    type: DataTypes.STRING,
  },
});
module.exports = Settings;
