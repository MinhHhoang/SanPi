const { STATUS_CONTACT } = require("../constant");
const Service = require("../services/contact.service");

exports.create = async (req, res) => {
 
  const object = {
    full_name: req.body.full_name,
    email: req.body.email,
    sdt: req.body.sdt,
    content: req.body.content,
    status: STATUS_CONTACT.IN_PROCESS
  };

  const result = await Service.create(object);

  return res.json({
    data: result,
    message: "Đã gửi thành công.",
    status: true,
  });
};

exports.submitContact = async (req, res) => {

  const object = await Service.findByID(req.params.id)

  if(object.status === STATUS_CONTACT.CANCEL) {
    return res.status(400).json({
      message: "Nội dung này đã được đóng rồi.",
      status: false,
    });
  }

  var result = await Service.update({...object,status : STATUS_CONTACT.CANCEL}, req.params.id);

  return res.json({
    data: result,
    message: "Đóng nội dung thành công.",
    status: true,
  });
};



exports.getObjects = async (req, res) => {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var query = req.query.query || "";

  var objects = await Service.findAll(page, limit, query);

  var total = await Service.getTotal(query);

  return res.status(200).json({
    results: objects.length,
    total: total,
    data: objects,
    status: true,
  });
};

exports.getObjectById = async (req, res) => {
  var object = await Service.findByID(req.params.id);
  return res.status(200).json({
    data: object,
    status: true,
  });
};


