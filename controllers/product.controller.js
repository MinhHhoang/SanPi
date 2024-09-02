const ProductService = require("../services/product.service");

exports.create = async (req, res) => {
  if (req.employeeCurrent.roleid === "EMPLOYEE") {
    return res.status(400).json({
      message: "Bạn không có quyền truy cập chức năng này.",
      status: false,
    });
  }

  const productData = {
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    content: req.body.content,
    time: req.body.time,
    crmschedule: req.body.crmschedule,
    numbersesion: req.body.numbersesion,
    distancegenerate: req.body.distancegenerate,
    price: req.body.price,
    active: 1,
  };

  const product = await ProductService.createProduct(productData);

  return res.json({
    data: product,
    message: "Đăng ký mới sản phẩm thành công.",
    status: true,
  });
};

exports.update = async (req, res) => {
  if (req.employeeCurrent.roleid === "EMPLOYEE") {
    return res.status(400).json({
      message: "Bạn không có quyền truy cập chức năng này.",
      status: false,
    });
  }

  const productData = {
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    content: req.body.content,
    time: req.body.time,
    crmschedule: req.body.crmschedule,
    numbersesion: req.body.numbersesion,
    distancegenerate: req.body.distancegenerate,
    price: req.body.price,
  };

  await ProductService.updateProduct(productData, req.params.id);

  var product = await ProductService.findByID(req.params.id);

  return res.json({
    data: product,
    message: "Cập nhật sản phẩm thành công.",
    status: true,
  });
};

exports.delete = async (req, res) => {
  if (req.employeeCurrent.roleid === "EMPLOYEE") {
    return res.status(400).json({
      message: "Bạn không có quyền truy cập chức năng này.",
      status: false,
    });
  }

  await ProductService.deleteProduct(req.params.id);

  return res.json({
    message: "Xóa sản phẩm thành công.",
    status: true,
  });
};

exports.getProducts = async (req, res) => {
  var query = req.query.query || "";
  var category = req.query.category || null;

  var products = await ProductService.findAll(query, category);

  var total = await ProductService.getTotal();

  return res.status(200).json({
    results: products.length,
    total: total,
    data: products,
    status: true,
  });
};

exports.getProductsActive = async (req, res) => {
  var query = req.query.query || "";
  var category = req.query.category || null;

  var products = await ProductService.findAllActive(query, category);

  var total = await ProductService.getTotal();

  return res.status(200).json({
    results: products.length,
    total: total,
    data: products,
    status: true,
  });
};

exports.getProductById = async (req, res) => {
  var product = await ProductService.findByID(req.params.id);

  return res.status(200).json({
    data: product,
    status: true,
  });
};

exports.setActive = async (req, res) => {
  let product = await ProductService.findByID(req.params.id);

  const productData = {
    ...product,
    active: !product["active"],
  };

  await ProductService.updateProduct(productData, req.params.id);

  return res.json({
    message: "Cập nhật trạng thái sản phẩm thành công.",
    status: true,
  });
};
