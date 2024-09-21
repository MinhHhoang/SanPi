const Model = require("../models/setting.model");
const Sequelize = require("sequelize");



exports.update = (object, id) => {
  return Model.update(object, {
    where: { id: id },
  });
};


exports.findOne = () => {
  return Model.findOne({
    where: {
      id: 1,
    },
  });
};



