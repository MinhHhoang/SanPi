const Customers = require("../models/customer.model");
const Model = require("../models/order_coin.model");
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

exports.findAll = (page, limit, customer_id, type, sku) => {
  const skip = (page - 1) * limit;
  return Model.findAll({
    where: {
      customer_id: customer_id,
      type_order: type,
      sku: { [Op.like]: `%${sku}%` },
    },
    order: [['id', 'DESC']], // Order by id in descending order
    limit: +limit,           // Limit the number of results per page
    offset: skip,           // Skip to the correct page
  });
};


exports.findAllAdmin = (page, limit, sku, type) => {
  const skip = (page - 1) * limit;
  return Model.findAll({
    where: {
      sku: { [Op.like]: `%${sku}%` },
      type_order: type,
    },
    order: [['id', 'DESC']], // Order by id in descending order
    limit: +limit,
    offset: skip,
    include: [
      {
        model: Customers, // Model Sequelize đại diện cho bảng Customer
      },
    ],
  });
};


exports.getTotal = (customer_id, type) => {
  return Model.count({
    where: {
      customer_id: customer_id,
      type_order: type,
    },
  });
};

exports.getTotalInProcess = (customer_id) => {
  return Model.count({
    where: {
      customer_id: customer_id,
      status_order: 'IN_PROCESS',
    },
  });
};

exports.getTotalAdmin = (sku, type) => {
  return Model.count({
    where: {
      sku: { [Op.like]: `%${sku}%` },
      type_order: type,
    },
  });
};
