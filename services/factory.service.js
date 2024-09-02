const FactoryModel = require("../models/factory.model");

exports.createFactory = (factory) => {
  return FactoryModel.create(factory);
};

exports.updateFactory = (factory, id) => {
  return FactoryModel.update(factory, {
    where: { id: id },
  });
};

exports.deleteFactory = (id) => {
  return FactoryModel.destroy({ where: { id: id } });
};

exports.findAll = () => {
  return FactoryModel.findAll();
};

exports.getTotal = () => {
  return FactoryModel.count();
};

exports.findByID = (id) => {
  return FactoryModel.findByPk(id);
};

exports.findByIds = (ids) => {
  return FactoryModel.findAll({
    where: {
      id: ids,
    },
  });
};
