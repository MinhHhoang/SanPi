const Model = require("../models/contact.model");
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
      [Op.or]: [
        { email: { [Op.like]: `%${query}%` } },
        { sdt: { [Op.like]: `%${query}%` } } // Assuming `sdt` is the column name for phone numbers
      ]
    }
  });
};

exports.getTotal = (query) => {
  return Model.count({
    where: {
      [Op.or]: [
        { email: { [Op.like]: `%${query}%` } },
        { sdt: { [Op.like]: `%${query}%` } } // Assuming `sdt` is the column name for phone numbers
      ]
    }
  });
};

exports.findByID = (id) => {
  return Model.findByPk(id);
};
