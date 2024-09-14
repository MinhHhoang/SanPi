const Service = require("../services/order_coin.service");
const ServiceCustomer = require("../services/customer.service");
const ServiceCoin = require("../services/coin.service");
const jwtConfig = require("../config/jwt.config");
const bcryptUtil = require("../utils/bcrypt.util");
const jwtUtil = require("../utils/jwt.util");
const { STATUS_ORDER, TYPE_COIN, TYPE_ORDER } = require("../constant");



exports.getCoinOrders = async (req, res) => {

  var page = req.query.page || 1;
  var limit = req.query.limit || 10;

  var ordercoins = await Service.findAll(page, limit, req.employeeCurrent.id);
  var total = await Service.getTotal(req.employeeCurrent.id);

  return res.status(200).json({
      results: ordercoins.length,
      total: total,
      data: ordercoins,
      status: true
  });
}

exports.create = async (req, res) => {
  const object = {
    sku: generateSKU(),
    status_order: STATUS_ORDER.IN_PROCESS,
    type_order: req.body.type_order,
    type_coin: req.body.type_coin,
    wallet_coin: req.body.wallet_coin,
    price_coin_current: req.body.price_coin_current,
    count_coin: req.body.count_coin,
    total_money: req.body.total_money,
    stk: req.body.stk,
    image_bill: req.body.image_bill,
    stk_name: req.body.stk_name,
    stk_bank: req.body.stk_bank,
    customer_id: req.employeeCurrent.id,
  };

  
  if (
    object.type_coin !== TYPE_COIN.PI_NETWORD &&
    object.type_coin !== TYPE_COIN.SIDRA
  ) {
    return res.status(400).json({
      message: "Chúng tôi hiện tại không support đồng coin này.",
      status: false,
    });
  }

  if (
    object.type_order !== TYPE_ORDER.BUY &&
    object.type_order !== TYPE_ORDER.SELL
  ) {
    return res.status(400).json({
      message: "Lỗi hệ thống .",
      status: false,
    });
  }

  const coin = ServiceCoin.findByCodeCoin(object.type_coin);

  if (object.count_coin < 5) {
    return res.status(400).json({
      message: "Số lượng không hợp lệ",
      status: false,
    });
  }

  if (object.type_order === TYPE_ORDER.BUY) {
    if (coin.giaban !== object.price_coin_current) {
      return res.status(400).json({
        message: "Thông tin giá không hợp lệ .",
        status: false,
      });
    }
    const totalMoney = object.count_coin * coin.giaban;

    if (totalMoney !== object.total_money) {
      return res.status(400).json({
        message: "Tổng số tiền không hợp lệ .",
        status: false,
      });
    }

    if (
      object.image_bill === "" ||
      object.image_bill === undefined ||
      object.image_bill === null ||
      object.wallet_coin === undefined ||
      object.wallet_coin === "" ||
      object.wallet_coin === null
    ) {
      return res.status(400).json({
        message: "Bill image là bắt buộc .",
        status: false,
      });
    }

    object = {
      ...object,
      stk: null,
      stk_name: null,
      stk_bank: null,
    };
  } else {
    if (coin.giamua !== object.price_coin_current) {
      return res.status(400).json({
        message: "Thông tin giá không hợp lệ .",
        status: false,
      });
    }

    if(object.type_coin === TYPE_COIN.SIDRA) {
        if(object.count_coin > customer.sidracoin) {
            return res.status(400).json({
                message: "Số dư của bạn không đủ .",
                status: false,
              });
        }
    }

    if(object.type_coin === TYPE_COIN.PI_NETWORD) {
        if(object.count_coin > customer.picoin) {
            return res.status(400).json({
                message: "Số dư của bạn không đủ .",
                status: false,
              });
        }
    }


    const totalMoney = object.count_coin * coin.giamua;
    if (totalMoney !== object.total_money) {
      return res.status(400).json({
        message: "Tổng số tiền không hợp lệ .",
        status: false,
      });
    }

    if (
      object.stk === "" ||
      object.stk === undefined ||
      object.stk === null ||
      object.stk_bank === undefined ||
      object.stk_bank === "" ||
      object.stk_bank === null ||
      object.stk_name === undefined ||
      object.stk_name === "" ||
      object.stk_name === null
    ) {
      return res.status(400).json({
        message: "Thông tin ngân hàng là bắt buộc .",
        status: false,
      });
    }

    object = {
      ...object,
      image_bill: null,
      wallet_coin: null,
    };
  }



  const order_coin = await Service.create(object);

  return res.json({
    order_coin : order_coin,
    message: "Đã gửi yêu cầu của bạn",
    status: true
  });
};

function generateSKU() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  // Format SKU as YYYYMMDDHHMMSS
  return `SKU${year}${month}${day}${hours}${minutes}${seconds}`;
}




