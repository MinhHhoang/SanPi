const Model = require("../models/banking.model");
const Customers = require("../models/customer.model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.create = (object) => {
  return Model.create(object);
};

exports.delete = (id) => {
  return Model.destroy({ where: { id: id } });
};

exports.findAllByCustomer = (idCustomer) => {
  return Model.findAll({
    include: [{
      model: Customers,
    }],
    where: {
      customer_id: idCustomer,
    },
  });
};


