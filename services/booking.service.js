const BookingService = require("../models/booking.model");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.createBooking = (booking) => {
  return BookingService.create(booking);
};

exports.updateBooking = (booking, id) => {
  return BookingService.update(booking, {
    where: { id: id },
  });
};

exports.findAll = (page, limit, query, status, timedate, timehour) => {
  const skip = (page - 1) * limit;
  return BookingService.findAll({
    order: [["id", "DESC"]],
    limit: +limit,
    offset: skip,
    where: {
      ...(!!status ? { status } : {}),
      ...(!!timedate ? { timedate } : {}),
      ...(!!timehour ? { timehour } : {}),
      phone: { [Op.like]: `%${query}%` },
    },
  });
};

exports.getStatistics = async (query, timedate, timehour) => {
  const statusList = ["IN_PROCCESS", "CONFIRMED", "DESTROYED"];

  const countPromises = statusList.map((status) => {
    return BookingService.count({
      where: {
        ...(!!timedate ? { timedate } : {}),
        ...(!!timehour ? { timehour } : {}),
        phone: { [Op.like]: `%${query}%` },
        status,
      },
    });
  });

  const [inProcessCount, confirmedCount, destroyedCount] = await Promise.all(
    countPromises
  );

  return {
    IN_PROCCESS: inProcessCount,
    CONFIRMED: confirmedCount,
    DESTROYED: destroyedCount,
  };
};

exports.findHistoryBooking = (
  page,
  limit,
  status,
  phone,
  timedate,
  timehour
) => {
  const skip = (page - 1) * limit;
  return BookingService.findAll({
    order: [["id", "DESC"]],
    limit: +limit,
    offset: skip,
    where: {
      ...(!!status ? { status } : {}),
      ...(!!timedate ? { timedate } : {}),
      ...(!!timehour ? { timehour } : {}),
      phone: phone,
    },
  });
};

exports.findAllByCustomer = (status, phone, timedate, timehour) => {
  return BookingService.findAll({
    order: [["id", "DESC"]],
    where: {
      ...(!!status ? { status } : {}),
      ...(!!timedate ? { timedate } : {}),
      ...(!!timehour ? { timehour } : {}),
      phone: phone,
    },
  });
};

exports.findAllByCustomerId = (idcustomer) => {
  return BookingService.findAll({
    where: {
      idcustomer,
    },
  });
};

exports.getTotal = (query, status, timedate, timehour) => {
  return BookingService.count({
    where: {
      ...(!!status ? { status } : {}),
      ...(!!timedate ? { timedate } : {}),
      ...(!!timehour ? { timehour } : {}),
      phone: { [Op.like]: `%${query}%` },
    },
  });
};

exports.findByID = (id) => {
  return BookingService.findByPk(id);
};
