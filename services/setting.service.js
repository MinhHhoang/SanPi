const SettingModel = require("../models/setting.model");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



exports.updateSetting = (setting) => {
  return SettingModel.update(setting, {
    where: { id: 1 },
  });
};


exports.findAll = () => {
  return SettingModel.findAll();
};

