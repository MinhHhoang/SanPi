const ProductModel = require("../models/product.model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.createProduct = (Product) => {
  return ProductModel.create(Product);
};

exports.updateProduct = (Product, id) => {
  return ProductModel.update(Product, {
    where: { id: id },
  });
};

exports.deleteProduct = (id) => {
  return ProductModel.destroy({ where: { id: id } });
};

exports.findAll = (query, category) => {
  return ProductModel.findAll({
    where: {
      ...(!!category ? { category } : {}),
      name: { [Op.like]: `%${query}%` },
    },
  });
};

exports.findAllActive = (query, category) => {
  return ProductModel.findAll({
    where: {
      ...(!!category ? { category } : {}),
      name: { [Op.like]: `%${query}%` },
      active: 1,
    },
  });
};

exports.findByIds = (ids) => {
  return ProductModel.findAll({
    where: {
      id: ids,
    },
  });
};

exports.getTotal = () => {
  return ProductModel.count();
};

exports.findByID = (id) => {
  return ProductModel.findByPk(id);
};
