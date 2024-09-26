const Service = require("../services/order_coin.service");
const ServiceCoin = require("../services/coin.service");
const ServiceSetting = require("../services/setting.service");
const ServiceCustomer = require("../services/customer.service");
const { STATUS_ORDER, TYPE_COIN, TYPE_ORDER } = require("../constant");
const fetch = require("node-fetch");
//toke
const TOKEN = "8128798044:AAF_foubtdZ3fgISd9USDPU6GPgVhFHzhNM";

async function sendMessage(message) {
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: 7147877943,
      text: message,
    }),
  });

  const data = await response.json();
  if (data.ok) {
    console.log("Message sent successfully:", data.result);
  } else {
    console.error("Error sending message:", data.description);
  }
}

exports.submitOrder = async (req, res) => {
  var setting = await ServiceSetting.findOne();

  var order = await Service.findById(req.params.id);

  if (!order || order.status_order !== STATUS_ORDER.IN_PROCESS) {
    return res.status(400).json({
      message: "Đơn hàng này không tồn tại hoặc đã được xử lý.",
      status: false,
    });
  }

  let customer = await ServiceCustomer.findById(order.customer_id);
  let customer_ref = await ServiceCustomer.findByEmailRef(customer.ref_email);

  if (order.type_order === TYPE_ORDER.BUY) {
    if (order.type_coin === TYPE_COIN.PI_NETWORD) {
      await ServiceCustomer.update(
        {
          ...customer,
          picoin:
            Number(customer.picoin) +
            Number(order.count_coin) -
            (Number(order.count_coin) * setting.fee_order) / 100,
        },
        customer.id
      );
    } else {
      await ServiceCustomer.update(
        {
          ...customer,
          sidracoin:
            Number(customer.sidracoin) +
            Number(order.count_coin) -
            (Number(order.count_coin) * setting.fee_order) / 100,
        },
        customer.id
      );
    }
  } else {
    if (order.type_order === TYPE_ORDER.SELL) {
      if (order.type_coin === TYPE_COIN.PI_NETWORD) {
        await ServiceCustomer.update(
          {
            ...customer,
            picoin:
              Number(customer.picoin) -
              Number(order.count_coin) -
              (Number(order.count_coin) * setting.fee_order) / 100,
          },
          customer.id
        );
      } else {
        await ServiceCustomer.update(
          {
            ...customer,
            sidracoin:
              Number(customer.sidracoin) -
              Number(order.count_coin) -
              (Number(order.count_coin) * setting.fee_order) / 100,
          },
          customer.id
        );
      }
    }
  }

  if (customer_ref) {
    if (order.type_coin === TYPE_COIN.PI_NETWORD) {
      await ServiceCustomer.update(
        {
          ...customer_ref,
          picoin: Number(customer.picoin) + Number(order.count_coin) * 0.1,
        },
        customer_ref.id
      );
    } else {
      await ServiceCustomer.update(
        {
          ...customer_ref,
          sidracoin:
            Number(customer.sidracoin) + Number(order.count_coin) * 0.1,
        },
        customer_ref.id
      );
    }
  }

  order = await Service.update(
    { ...order, status_order: STATUS_ORDER.SUCCESS },
    order.id
  );

  return res.status(200).json({
    order: order,
    message: "Đơn hàng đã hoàn thành.",
    status: true,
  });
};

exports.cancelOrder = async (req, res) => {
  var order = await Service.findById(req.params.id);

  if (!order || order.status_order !== STATUS_ORDER.IN_PROCESS) {
    return res.status(400).json({
      message: "Đơn hàng này không tồn tại hoặc đã được xử lý.",
      status: false,
    });
  }

  order = await Service.update(
    { ...order, status_order: STATUS_ORDER.CANCEL },
    order.id
  );

  return res.status(200).json({
    order: order,
    message: "Đơn hàng đã được hủy.",
    status: true,
  });
};

exports.getCoinOrders = async (req, res) => {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var type = req.query.type || "BUY";
  var sku = req.query.sku || "";

  var ordercoins = await Service.findAll(
    page,
    limit,
    req.employeeCurrent.id,
    type,
    sku
  );
  var total = await Service.getTotal(req.employeeCurrent.id, type);

  return res.status(200).json({
    results: ordercoins.length,
    total: total,
    data: ordercoins,
    status: true,
  });
};

exports.searchOrder = async (req, res) => {
  var sku = req.query.sku;
  var order = await Service.findBySku(sku);
  return res.status(200).json({
    order: order,
    status: true,
  });
};

exports.getCoinOrdersAdmin = async (req, res) => {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var sku = req.query.sku || "";
  var type = req.query.type || "BUY";

  var ordercoins = await Service.findAllAdmin(page, limit, sku, type);
  var total = await Service.getTotalAdmin(sku, type);

  return res.status(200).json({
    results: ordercoins.length,
    total: total,
    data: ordercoins,
    status: true,
  });
};

exports.create = async (req, res) => {
  let object = {
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

  if (![TYPE_COIN.PI_NETWORD, TYPE_COIN.SIDRA].includes(object.type_coin)) {
    return res.status(400).json({
      message: "Chúng tôi hiện tại không support đồng coin này.",
      status: false,
    });
  }
  if (
    ![TYPE_ORDER.BUY, TYPE_ORDER.SELL, TYPE_ORDER.SELL_HOT].includes(
      object.type_order
    )
  ) {
    return res.status(400).json({
      message: "Lỗi hệ thống .",
      status: false,
    });
  }

  const coin = await ServiceCoin.findByCodeCoin(object.type_coin);
  const customer = await ServiceCustomer.findByEmail(req.employeeCurrent.email);

  if (object.count_coin < 5) {
    return res.status(400).json({
      message: "Số lượng không hợp lệ",
      status: false,
    });
  }

  if (object.type_order === TYPE_ORDER.BUY) {
    console.log(Number(coin.giaban));
    console.log(Number(object.price_coin_current));
    if (Number(coin.giaban) !== Number(object.price_coin_current)) {
      return res.status(400).json({
        message: "Thông tin giá không hợp lệ .",
        status: false,
      });
    }

    // const totalMoney = Number(object.count_coin) * Number(coin.giaban);
    // if (totalMoney !== object.total_money) {
    //   return res.status(400).json({
    //     message: "Tổng số tiền không hợp lệ .",
    //     status: false,
    //   });
    // }

    if (!object.image_bill || !object.wallet_coin) {
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

    if (object.type_coin === TYPE_COIN.SIDRA) {
      if (object.count_coin > customer.sidracoin) {
        return res.status(400).json({
          message: "Số dư của bạn không đủ .",
          status: false,
        });
      }
    }

    if (object.type_coin === TYPE_COIN.PI_NETWORD) {
      if (object.count_coin > customer.picoin) {
        return res.status(400).json({
          message: "Số dư của bạn không đủ .",
          status: false,
        });
      }
    }

    // const totalMoney = object.count_coin * coin.giamua;
    // if (totalMoney !== object.total_money) {
    //   return res.status(400).json({
    //     message: "Tổng số tiền không hợp lệ .",
    //     status: false,
    //   });
    // }

    if (!object.stk || !object.stk_bank || !object.stk_name) {
      return res.status(400).json({
        message: "Thông tin ngân hàng là bắt buộc .",
        status: false,
      });
    }

    object = {
      ...object,
      image_bill:
        object.type_order === TYPE_ORDER.SELL_HOT ? object.image_bill : null,
      wallet_coin: null,
    };
  }

  const order_coin = await Service.create(object);

  let notificationMessage = `
  SKU: ${object.sku}
  Status: ${object.status_order}
  Order Type: ${object.type_order}
  Coin Type: ${object.type_coin}
  Wallet: ${object.wallet_coin}
  Current Price: ${object.price_coin_current}
  Coin Count: ${object.count_coin}
  Total Money: ${object.total_money}
  STK: ${object.stk}
  Bill Image: ${object.image_bill}
  STK Name: ${object.stk_name}
  STK Bank: ${object.stk_bank}
  Customer ID: ${object.customer_id}
`;

  await sendMessage(notificationMessage);

  return res.json({
    order_coin: order_coin,
    message: "Đã gửi yêu cầu của bạn",
    status: true,
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
