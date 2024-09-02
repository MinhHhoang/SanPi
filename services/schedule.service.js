const ScheduleService = require("../models/schedule.model");
const Sequelize = require("sequelize");
const moment = require("moment");
const { STATUS } = require("../constant");
const Op = Sequelize.Op;

exports.createSchedule = (schedule) => {
  return ScheduleService.create(schedule);
};

exports.updateSchedule = (schedule, id) => {
  return ScheduleService.update(schedule, {
    where: { id: id },
  });
};

exports.findAllByIdBooking = (idbooking, status, timedate, timehour) => {
  return ScheduleService.findAll({
    where: {
      ...(!!status ? { status } : {}),
      ...(!!timedate ? { timedate } : {}),
      ...(!!timehour ? { timehour } : {}),
      idbooking: idbooking,
    },
  });
};

exports.findAllByIdBookingDetailService = (
  idbookingdetail,
  status,
  timedate,
  timehour
) => {
  return ScheduleService.findAll({
    where: {
      ...(!!status ? { status } : {}),
      ...(!!timedate ? { timedate } : {}),
      ...(!!timehour ? { timehour } : {}),
      idbookingdetail: idbookingdetail,
    },
    order: [["session", "ASC"]],
  });
};

exports.findAllSchedulesToday = () => {
  const todayDate = moment().format("YYYY-MM-DD");
  return ScheduleService.findAll({
    where: {
      timedate: todayDate,
      status: STATUS.IN_PROCCESS,
    },
  });
};

exports.findAllSchedulesBeforeToday = (numberdayBefore) => {
  const tomorrowDate = moment()
    .add(numberdayBefore, "days")
    .format("YYYY-MM-DD");
  return ScheduleService.findAll({
    where: {
      timedate: tomorrowDate,
      status: STATUS.IN_PROCCESS,
    },
  });
};

exports.findByID = (id) => {
  return ScheduleService.findByPk(id);
};

exports.deleteSchedulesByBookingID = (id) => {
  return ScheduleService.destroy({ where: { idbooking: id } });
};
