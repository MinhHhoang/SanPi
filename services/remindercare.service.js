const ReminderCareModel = require("../models/remindercare.model");
const Sequelize = require("sequelize");
const moment = require('moment');
const { STATUS } = require("../constant");
const Op = Sequelize.Op;

exports.createReminderCare = (reminder) => {
    return ReminderCareModel.create(reminder);
};

exports.updateReminderCare = (reminder, id) => {
    return ReminderCareModel.update(reminder, {
        where: { id: id },
    });
};

exports.findAllByIdBySchedule = (idSchedule, status, timedate) => {
    return ReminderCareModel.findAll({
        where: {
            ...(!!status ? { status } : {}),
            ...(!!timedate ? { timedate } : {}),
            idschedule: idSchedule
        },
    });
};

exports.findAllRemindersToday = () => {
    const todayDate = moment().format('YYYY-MM-DD');
    return ReminderCareModel.findAll({
        where: {
            timedate: todayDate,
            status : STATUS.IN_PROCCESS
        }
    });
};


exports.findAllRemindersByService = (idbookingdetail) => {
    return ReminderCareModel.findAll({
        where: {
            idbookingdetail : idbookingdetail
        }
    });
};

exports.findByID = (id) => {
    return ReminderCareModel.findByPk(id);
};


