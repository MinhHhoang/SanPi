const EmployeeModel = require('../models/employee.model');
const cacheUtil = require('../utils/cache.util');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.createEmployee = (employee) => {
  return EmployeeModel.create(employee);
}

exports.updateEmployee = (employee, id) => {
  return EmployeeModel.update(employee, {
    where: { id: id },
  });
};

exports.findEmployeeByEmail = (email) => {
  return EmployeeModel.findOne({
    where: {
      email: email,
    }
  })
}

exports.findEmployeeById = (id) => {
  return EmployeeModel.findByPk(id);
}

exports.logoutEmployee = (token, exp) => {
  const now = new Date();
  const expire = new Date(exp * 1000);
  const milliseconds = expire.getTime() - now.getTime();
  /* ----------------------------- BlackList Token ---------------------------- */
  return cacheUtil.set(token, token, milliseconds);
}

exports.findAll = (page, limit, query) => {
  const skip = (page - 1) * limit;
  return EmployeeModel.findAll({
    limit: +limit,
    offset: skip,
    where: {
      [Op.or]: {
        username: { [Op.like]: `%${query}%` },
        email: { [Op.like]: `%${query}%` },
      }
    },
  });
};

exports.getTotal = () => {
  return EmployeeModel.count();
};



