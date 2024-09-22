const Service = require("../services/setting.service");



exports.update = async (req, res) => {

  const object = {
    fee_order: req.body.fee_order,
    momo_pay : req.body.momo_pay,
    banking1: req.body.banking1,
    banking2: req.body.banking2,
  };


  var result = await Service.update(object, 1);

  return res.json({
    data: result,
    message: "Cập nhật thành công.",
    status: true,
  });
};

exports.getObjectById = async (req, res) => {
  var object = await Service.findOne();
  return res.status(200).json({
    data: object,
    status: true,
  });
};


