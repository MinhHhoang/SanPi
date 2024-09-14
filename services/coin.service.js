const Model = require("../models/coin.model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.create = (object) => {
  return Model.create(object);
};

exports.update = (object, id) => {
  return Model.update(object, {
    where: { id: id },
  });
};

exports.delete = (id) => {
  return Model.destroy({ where: { id: id } });
};

exports.findAll = (page, limit, query) => {
  const skip = (page - 1) * limit;
  return Model.findAll({
    limit: +limit,
    offset: skip,
    where: {
      name: { [Op.like]: `%${query}%` },
    },
  });
};

exports.getTotal = (query) => {
  return Model.count({
    where: {
      name: { [Op.like]: `%${query}%` },
    },
  });
};

exports.findByID = (id) => {
  return Model.findByPk(id);
};


exports.findByCodeCoin = (code) => {
  return Model.findOne({
    where: {
      code: code,
    }
  })
}
