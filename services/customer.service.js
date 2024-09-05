const Model = require('../models/customer.model');
const cacheUtil = require('../utils/cache.util');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.create = (object) => {
  return Model.create(object);
}

exports.update = (object, id) => {
  return Model.update(object, {
    where: { id: id },
  });
};

exports.findByEmail = (email) => {
  return Model.findOne({
    where: {
      email: email,
    }
  })
}

exports.findById = (id) => {
  return Model.findByPk(id);
}


exports.logout = (token, exp) => {
  const now = new Date();
  const expire = new Date(exp * 1000);
  const milliseconds = expire.getTime() - now.getTime();
  /* ----------------------------- BlackList Token ---------------------------- */
  return cacheUtil.set(token, token, milliseconds);
}

exports.findAll = (page, limit, query) => {
  const skip = (page - 1) * limit;
  return Model.findAll({
    limit: +limit,
    offset: skip,
    where: {
      email: { [Op.like]: `%${query}%` },
    },
  });
};

exports.getTotal = (query) => {
  return Model.count({
    where: {
      email: { [Op.like]: `%${query}%` },
    },
  });
};



