const CustomerModel = require('../models/customer.model');
const cacheUtil = require('../utils/cache.util');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.createCustomer = (customer) => {
  return CustomerModel.create(customer);
}

exports.updateCustomer = (customer, id) => {
  return CustomerModel.update(customer, {
    where: { id: id },
  });
};

exports.findCustomerByEmail = (email) => {
  return CustomerModel.findOne({
    where: {
      email: email,
    }
  })
}

exports.findCustomerByPhone = (phone) => {
    return CustomerModel.findOne({
      where: {
        phone: phone,
      }
    })
  }

exports.findCustomerById = (id) => {
  return CustomerModel.findByPk(id);
}



exports.findAll = (page, limit, query, active) => {
  const skip = (page - 1) * limit;
  return CustomerModel.findAll({
    limit: +limit,
    offset: skip,
    where: {
      ...(!!active ? {active} : {}), 
      [Op.or]: {
        fullname: { [Op.like]: `%${query}%` },
        phone: { [Op.like]: `%${query}%` },
        email: { [Op.like]: `%${query}%` },
      }
    },
  });
};

exports.getTotal = () => {
  return CustomerModel.count();
};



