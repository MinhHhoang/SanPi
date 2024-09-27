const Customers = require("../models/customer.model");
const Model = require("../models/buy_coin.model");
const cacheUtil = require("../utils/cache.util");
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

exports.findBySku = (sku) => {
  return Model.findOne({
    where: {
      sku: sku,
    },
  });
};

exports.findById = (id) => {
  return Model.findByPk(id);
};

exports.findAll = (page, limit, customer_id, sku) => {
  const skip = (page - 1) * limit;
  return Model.findAll({
    limit: +limit,
    offset: skip,
    where: {
      customer_id: customer_id,
      sku: { [Op.like]: `%${sku}%` },
    },
  });
};

exports.findAllAdmin = (page, limit, sku) => {
  const skip = (page - 1) * limit;
  return Model.findAll({
    limit: +limit,
    offset: skip,
    where: {
      sku: { [Op.like]: `%${sku}%` },
    },
    include: [
      {
        model: Customers, // Model Sequelize đại diện cho bảng Customer
      },
    ],
  });
};

exports.getTotal = (customer_id) => {
  return Model.count({
    where: {
      customer_id: customer_id,
    },
  });
};



exports.getTotalAdmin = (sku) => {
  return Model.count({
    where: {
      sku: { [Op.like]: `%${sku}%` },
    },
  });
};
