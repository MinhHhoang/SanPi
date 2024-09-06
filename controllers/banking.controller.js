const Service = require("../services/banking.service");

exports.create = async (req, res) => {
  const object = {
    customer_id: req.body.customer_id,
    name_bank: req.body.name_bank,
    stk: req.body.stk,
    full_name: req.body.full_name,
  };

  const result = await Service.create(object);

  return res.json({
    data: result,
    message: "Tạo thành công.",
    status: true,
  });
};

exports.delete = async (req, res) => {
  await Service.delete(req.params.id);
  return res.json({
    message: "Xóa thành công.",
    status: true,
  });
};

exports.getBankings = async (req, res) => {
  var objects = await Service.findAllByCustomer(req.params.id);
  return res.status(200).json({
    data: objects,
    status: true,
  });
};



