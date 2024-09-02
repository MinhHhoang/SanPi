const BookingDetailModel = require("../models/bookingdetail.model");
const { STATUS } = require("../constant");
const Sequelize = require("sequelize");
const moment = require("moment");
const Op = Sequelize.Op;

exports.createBookingDetail = (bookingdetail) => {
  return BookingDetailModel.create(bookingdetail);
};

exports.updateBookingDetail = (bookingdetail, id) => {
  return BookingDetailModel.update(bookingdetail, {
    where: { id: id },
  });
};

exports.findAllByIdBooking = (idbooking, status, timedate, timehour) => {
  return BookingDetailModel.findAll({
    where: {
      ...(!!status ? { status } : {}),
      ...(!!timedate ? { timedate } : {}),
      ...(!!timehour ? { timehour } : {}),
      idbooking: idbooking,
    },
  });
};

exports.findAll = (page, limit, query, status, timedate, timehour) => {
  const skip = (page - 1) * limit;
  return BookingDetailModel.findAll({
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
  const statusList = ["IN_PROCCESS", "SUCCESS", "DESTROYED"];

  const countPromises = statusList.map((status) => {
    return BookingDetailModel.count({
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
    SUCCESS: confirmedCount,
    DESTROYED: destroyedCount,
  };
};

exports.totalCount = (query, status, timedate, timehour) => {
  return BookingDetailModel.count({
    where: {
      ...(!!status ? { status } : {}),
      ...(!!timedate ? { timedate } : {}),
      ...(!!timehour ? { timehour } : {}),
      phone: { [Op.like]: `%${query}%` },
    },
  });
};

exports.findAllByIdBookingDetails = (id) => {
  return BookingDetailModel.findByPk(id);
};

exports.deleteBookingDetailByBookingID = (id) => {
  return BookingDetailModel.destroy({ where: { idbooking: id } });
};

exports.getOverview = () => {
  return BookingDetailModel.findAll({
    attributes: [
      [Sequelize.fn("SUM", Sequelize.col("price")), "totalRevenue"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "totalBookings"],
      [
        Sequelize.fn(
          "COUNT",
          Sequelize.fn("DISTINCT", Sequelize.col("idcustomer"))
        ),
        "totalCustomers",
      ],
      [
        Sequelize.fn(
          "COUNT",
          Sequelize.fn("DISTINCT", Sequelize.col("service"))
        ),
        "totalServices",
      ],
    ],
    where: {
      status: STATUS.SUCCESS,
    },
  });
};

exports.statisticStatus = () => {
  return BookingDetailModel.findAll({
    attributes: [
      "status",
      [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
    ],
    group: ["status"],
  });
};

exports.getTop10Services = () => {
  return BookingDetailModel.findAll({
    attributes: [
      "service",
      [Sequelize.fn("COUNT", Sequelize.col("service")), "serviceCount"],
    ],
    group: ["service"],
    order: [[Sequelize.fn("COUNT", Sequelize.col("service")), "DESC"]],
    limit: 10,
  });
};
