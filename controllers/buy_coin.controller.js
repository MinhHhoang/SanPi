const Service = require("../services/buy_coin.service");
const ServiceCustomer = require("../services/customer.service");
const { STATUS_ORDER, TYPE_COIN } = require("../constant");
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

exports.submitlOrder = async (req, res) => {
  var order = await Service.findById(req.params.id);

  if (!order || order.status_order !== STATUS_ORDER.IN_PROCESS) {
    return res.status(400).json({
      message: "Đơn hàng này không tồn tại hoặc đã được xử lý.",
      status: false,
    });
  }

  order = await Service.update(
    { ...order, status_order: STATUS_ORDER.SUCCESS },
    order.id
  );

  return res.status(200).json({
    order: order,
    message: "Đơn hàng hoàn thành.",
    status: true,
  });
};

exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Fetch both order and customer in a single query
    const [order, customer] = await Promise.all([
      Service.findById(orderId),
      ServiceCustomer.findById(order.customer_id),
    ]);

    // Check for valid order and status early
    if (!order || order.status_order !== STATUS_ORDER.IN_PROCESS) {
      return res.status(400).json({
        message: "Đơn hàng này không tồn tại hoặc đã được xử lý.",
        status: false,
      });
    }

    // Prepare updated coin amount based on the coin type
    const coinType = order.type_coin === TYPE_COIN.PI_NETWORD ? 'picoin' : 'sidracoin';
    const updatedAmount = Number(customer[coinType]) + Number(order.count_coin);

    // Update the customer's coin amount in a single call
    await ServiceCustomer.update(
      { ...customer, [coinType]: updatedAmount },
      order.customer_id
    );

    // Update the order status
    const updatedOrder = await Service.update(
      { ...order, status_order: STATUS_ORDER.CANCEL },
      order.id
    );

    return res.status(200).json({
      order: updatedOrder,
      message: "Đơn hàng đã được hủy.",
      status: true,
    });
  } catch (error) {
    console.error("Error canceling order:", error); // Log the error for debugging
    return res.status(500).json({
      message: "Có lỗi xảy ra khi hủy đơn hàng.",
      status: false,
      error: error.message,
    });
  }
};


exports.getCoinOrdersForCustomer = async (req, res) => {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var sku = req.query.sku || "";
  var customer_id = req.query?.customerId || req.employeeCurrent.id;

  var ordercoins = await Service.findAll(page, limit, customer_id, sku);
  var total = await Service.getTotal(customer_id, sku);

  return res.status(200).json({
    results: ordercoins.length,
    total: total,
    data: ordercoins,
    status: true,
  });
};

exports.getCoinOrdersAdmin = async (req, res) => {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var sku = req.query.sku || "";

  var ordercoins = await Service.findAllAdmin(page, limit, sku);
  var total = await Service.getTotalAdmin(sku);

  return res.status(200).json({
    results: ordercoins.length,
    total: total,
    data: ordercoins,
    status: true,
  });
};

exports.create = async (req, res) => {
  const { type_coin, wallet_coin, count_coin } = req.body;
  const customerEmail = req.employeeCurrent.email;
  const customerId = req.employeeCurrent.id;

  // Early return for invalid count_coin
  if (count_coin < 1) {
    return res.status(400).json({
      message: "Số lượng không hợp lệ",
      status: false,
    });
  }

  // Fetch customer details
  const customer = await ServiceCustomer.findByEmail(customerEmail);

  // Validate wallet and balance based on coin type
  let walletMismatchMessage = "Hai địa chỉ ví không khớp";
  let insufficientBalanceMessage = "Hiện tại số dư không đủ";
  let updatedBalance;

  if (type_coin === TYPE_COIN.PI_NETWORD) {
    if (wallet_coin !== customer.wallet_pi) {
      return res
        .status(400)
        .json({ message: walletMismatchMessage, status: false });
    }
    if (count_coin > customer.picoin) {
      return res
        .status(400)
        .json({ message: insufficientBalanceMessage, status: false });
    }
    updatedBalance = { ...customer, picoin: customer.picoin - count_coin };
  } else {
    if (wallet_coin !== customer.wallet_sidra) {
      return res
        .status(400)
        .json({ message: walletMismatchMessage, status: false });
    }
    if (count_coin > customer.sidracoin) {
      return res
        .status(400)
        .json({ message: insufficientBalanceMessage, status: false });
    }
    updatedBalance = {
      ...customer,
      sidracoin: customer.sidracoin - count_coin,
    };
  }

  // Update customer balance
  await ServiceCustomer.update(updatedBalance, customerId);

  // Create the order
  const orderObject = {
    sku: generateSKU(),
    status_order: STATUS_ORDER.IN_PROCESS,
    type_coin,
    wallet_coin,
    count_coin,
    customer_id: customerId,
  };

  const order = await Service.create(orderObject);

  // Prepare and send notification
  const notificationMessage = `
    SKU: ${orderObject.sku}
    Status: ${orderObject.status_order}
    Coin Type: ${orderObject.type_coin}
    Wallet: ${orderObject.wallet_coin}
    Coin Count: ${orderObject.count_coin}
    Customer ID: ${orderObject.customer_id}
  `;

  await sendMessage(notificationMessage);

  return res.json({
    order_coin: order,
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
