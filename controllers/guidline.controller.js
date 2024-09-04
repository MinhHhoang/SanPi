const Service = require("../services/guidline.service");

exports.create = async (req, res) => {
 
  const object = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    video_url : req.body.video_url,
  };

  const result = await Service.create(object);

  return res.json({
    data: result,
    message: "Tạo thành công.",
    status: true,
  });
};

exports.update = async (req, res) => {

  const object = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    video_url : req.body.video_url,
  };

  await Service.update(object, req.params.id);

  var result = await Service.findByID(req.params.id);

  return res.json({
    data: result,
    message: "Cập nhật thành công.",
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


