const CustomerService = require("../services/customer.service");
const BookingService = require("../services/booking.service");
const ProductService = require("../services/product.service");
const FactoryService = require("../services/factory.service");
const jwtConfig = require("../config/jwt.config");
const jwtUtil = require("../utils/jwt.util");
const { STATUS } = require("../constant");

exports.create = async (req, res) => {
  const customer = await CustomerService.findCustomerByPhone(req.body.phone);
  if (customer) {
    return res.status(400).json({
      message: "Số điện thoại đã tồn tại.",
      status: false,
    });
  }

  const cusData = {
    phone: req.body.phone,
    codepin: req.body.codepin,
    fullname: req.body.fullname || "",
    email: req.body.email || "",
    address: req.body.address || "",
    active: 1,
  };

  const custTmp = await CustomerService.createCustomer(cusData);
  return res.json({
    data: custTmp,
    message: "Tạo mới khách hàng thành công.",
    status: true,
  });
};

exports.update = async (req, res) => {
  let customer = await CustomerService.findCustomerById(req.params.id);

  if (!customer) {
    return res.json({
      message: "Không tìm thấy khách hàng tương ứng.",
      status: false,
    });
  }

  const cusTmp = {
    ...customer,
    fullname: req.body.fullname,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    address: req.body.address || "",
    image: req.body.image,
  };

  await CustomerService.updateCustomer(cusTmp, req.params.id);

  customer = await CustomerService.findCustomerByPhone(req.body.phone);

  return res.json({
    data: customer,
    message: "Cập nhật khách hàng thành công.",
    status: true,
  });
};

exports.login = async (req, res) => {
  const customer = await CustomerService.findCustomerByPhone(req.body.phone);

  if (!customer) {
    return res.json({
      message: "Khách hàng không tồn tại.",
      status: false,
    });
  }

  if (customer) {
    if (customer.codepin === req.body.codepin) {
      const token = await jwtUtil.createToken({
        id: customer.id,
        phone: customer.phone,
      });
      return res.json({
        customer: customer,
        access_token: token,
        token_type: "Bearer",
        expires_in: jwtConfig.ttl,
        status: true,
      });
    }
  }
  return res
    .status(400)
    .json({ message: "Đăng nhập không thành công", status: false });
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await CustomerService.findCustomerById(req.params.id);

    if (!customer) {
      return res.json({
        message: "Khách hàng không tồn tại.",
        status: false,
      });
    }

    var bookings = await BookingService.findAllByCustomerId(customer.id);
    customer.dataValues.listBooking = bookings;

    const factoryCount = {};
    const serviceCount = {};

    const bookingPromises = bookings.map(async (booking) => {
      const factory = await FactoryService.findByID(booking.dataValues.factoryid);
      booking.dataValues.factory = factory;

      factoryCount[factory.id] = (factoryCount[factory.id] || 0) + 1;

      const serviceIds = JSON.parse(booking.dataValues.services);
      const services = await ProductService.findByIds(serviceIds);
      booking.dataValues.listService = services;

      serviceIds.forEach((serviceId) => {
        serviceCount[serviceId] = (serviceCount[serviceId] || 0) + 1;
      });

      return booking;
    });

    bookings = await Promise.all(bookingPromises);

    const factoryIds = [...new Set(bookings.map((item) => item.factoryid))];
    var listFactory = await FactoryService.findByIds(factoryIds);
    listFactory.forEach((factory) => {
      factory.dataValues.count = factoryCount[factory.id] || 0;
    });
    customer.dataValues.listFactory = listFactory;

    const serviceIds = bookings.flatMap((item) => JSON.parse(item.services));
    var services = await ProductService.findByIds(serviceIds);
    services.forEach((service) => {
      service.dataValues.count = serviceCount[service.id] || 0;
    });
    customer.dataValues.listService = services;

    return res.json({
      data: customer,
      message: "Success.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Đã xảy ra lỗi.",
      error: error.message,
    });
  }
};

exports.checkCustomerIsNotExist = async (req, res) => {
  const customer = await CustomerService.findCustomerByPhone(req.params.phone);

  if (!customer) {
    return res.json({
      status: true,
    });
  }

  return res.json({
    status: false,
  });
};

exports.getCustomers = async (req, res) => {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var query = req.query.query || "";
  var active = req.query.active || null;

  var customers = await CustomerService.findAll(page, limit, query, active);
  var total = await CustomerService.getTotal();

  return res.status(200).json({
    results: customers.length,
    total: total,
    data: customers,
    status: true,
  });
};

exports.changeCodePin = async (req, res) => {
  console.log(req.params.id);

  let customer = await CustomerService.findCustomerById(req.params.id);

  if (!customer) {
    return res.json({
      message: "Khách hàng không tồn tại.",
      status: false,
    });
  }

  const customerData = {
    ...customer,
    codepin: req.body.codepin,
  };

  await CustomerService.updateCustomer(customerData, req.params.id);

  customer = await CustomerService.findCustomerById(req.params.id);

  return res.json({
    data: customer,
    message: "Đổi mã pin thành công.",
    status: true,
  });
};

exports.setActive = async (req, res) => {
  let customer = await CustomerService.findCustomerById(req.params.id);

  if (!customer) {
    return res.json({
      message: "Khách hàng không tồn tại.",
      status: false,
    });
  }

  const cusData = {
    ...customer,
    active: !customer["active"],
  };

  await CustomerService.updateCustomer(cusData, req.params.id);

  return res.json({
    message: "Cập nhật trạng thái khách hàng thành công.",
    status: true,
  });
};

exports.getHistoryBooking = async (req, res) => {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var timedate = req.query.timedate || null;
  var timehour = req.query.timehour || null;
  var status = STATUS.CONFIRMED;

  var idcustomer = req.params.idcustomer;
  var customer = await CustomerService.findCustomerById(idcustomer);

  var historyBookings = await BookingService.findHistoryBooking(
    page,
    limit,
    status,
    customer.phone,
    timedate,
    timehour
  );

  var totalHistory = await BookingService.findAllByCustomer(
    status,
    customer.phone,
    timedate,
    timehour
  );

  var total = 0;

  totalHistory = await Promise.all(
    totalHistory.map(async (booking) => {
      var services = booking.dataValues.services
        .slice(1, -1)
        .split(",")
        .map((item) => parseInt(item));

      total = total + services.length;
    })
  );

  var listServiceHistory = [];

  historyBookings = await Promise.all(
    historyBookings.map(async (booking) => {
      var services = booking.dataValues.services
        .slice(1, -1)
        .split(",")
        .map((item) => parseInt(item));

      for (let index = 0; index < services.length; index++) {
        const service = await ProductService.findByID(services[index]);
        service.dataValues.dateproccess = booking.timedate;
        listServiceHistory.push(service);
      }
    })
  );

  // Sắp xếp mảng theo trường dateproccess giảm dần
  listServiceHistory.sort(
    (a, b) =>
      new Date(b.dataValues.dateproccess) - new Date(a.dataValues.dateproccess)
  );

  return res.status(200).json({
    results: listServiceHistory.length,
    data: listServiceHistory,
    total: total,
    status: true,
  });
};
