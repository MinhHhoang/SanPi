const BookingService = require("../services/booking.service");
const CustomerService = require("../services/customer.service");
const ProductService = require("../services/product.service");
const FactoryService = require("../services/factory.service");
const ScheduleService = require("../services/schedule.service");
const ReminderCareService = require("../services/remindercare.service");
const BookingDetailService = require("../services/bookingdetail.service");
const SettingService = require('../services/setting.service');
const moment = require("moment");
const { STATUS, CATEGORY } = require("../constant");


exports.generateSchedule = async (req, res) => {
  let idbooking = req.body.idbooking;

  try {
    const booking = await BookingService.findByID(idbooking);

    if (booking.status !== STATUS.IN_PROCCESS) {
      return res.status(200).json({
        message: "Đơn đã được tạo, không thể tạo thêm lần nữa",
        status: false,
      });
    }

    let idcustomer = booking.idcustomer;
    let phone = booking.phone;
    let factoryid = booking.factoryid;
    let timedate = booking.timedate;
    let timehour = booking.timehour;

    var services = booking.services
      .slice(1, -1)
      .split(",")
      .map((item) => parseInt(item));

    // Array to store promises of schedule creation
    let createSchedulePromises = [];

    // Process each service asynchronously
    await Promise.all(
      services.map(async (service) => {
        const product = await ProductService.findByID(service);

        var bookingDetail = {
          idbooking: idbooking,
          idcustomer: idcustomer,
          phone: phone,
          factoryid: factoryid,
          note: "",
          service: service,
          price: product.price,
          timehour: timehour,
          timedate: timedate,
          status: STATUS.IN_PROCCESS
        }

        const bookingdetail = await BookingDetailService.createBookingDetail(bookingDetail);

        let countDate = 1;
        if (product.category == CATEGORY.TRIET_LONG) {
          countDate = product.numbersesion;
        }

        // Create schedule for the initial timedate
        const initialDataSchedule = {
          idbooking: idbooking,
          idcustomer: idcustomer,
          session: 1,
          idbookingdetail: bookingdetail.id,
          phone: phone,
          factoryid: factoryid,
          note: "",
          serviceid: product.id,
          timehour: timehour,
          timedate: timedate,
          status: STATUS.IN_PROCCESS,
        };

        createSchedulePromises.push(
          ScheduleService.createSchedule(initialDataSchedule)
        );

        // Create schedules for subsequent dates if necessary
        const currentDate = moment(timedate);
        const distanceGenerate = product.distancegenerate;
        for (let index = 1; index <= countDate - 1; index++) {
          const nextDate = currentDate
            .clone()
            .add(index * distanceGenerate, "days")
            .format("YYYY-MM-DD");
          const dataSchedule = {
            idbooking: idbooking,
            idcustomer: idcustomer,
            session: index + 1,
            idbookingdetail: bookingdetail.id,
            phone: phone,
            factoryid: factoryid,
            note: "",
            serviceid: product.id,
            timehour: timehour,
            timedate: nextDate,
            status: STATUS.IN_PROCCESS,
          };

          createSchedulePromises.push(
            ScheduleService.createSchedule(dataSchedule)
          );
        }
      })
    );

    // Wait for all createSchedule promises to complete
    await Promise.all(createSchedulePromises);

    await BookingService.updateBooking(
      { ...booking, status: STATUS.CONFIRMED },
      idbooking
    );

    return res.status(200).json({
      message: STATUS.CONFIRMED,
      status: true,
    });
  } catch (error) {
    // Handle error
    console.error("Error generating schedule:", error);

    // Rollback logic - assuming you have a rollback mechanism in ScheduleService
    // For example, if ScheduleService.createSchedule() supports deletion by idbooking,
    // you could implement a rollback like this:
    try {
      await ScheduleService.deleteSchedulesByBookingID(idbooking);
      await BookingDetailService.deleteBookingDetailByBookingID(idbooking);
      console.log("Rollback successful");
    } catch (rollbackError) {
      console.error("Rollback failed:", rollbackError);
    }

    return res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình xử lý, vui lòng thử lại sau",
      status: false,
    });
  }
};

exports.getSchedules = async (req, res) => {
  var idbooking = req.params.idbooking;
  var timedate = req.query.timedate || null;
  var timehour = req.query.timehour || null;
  var status = req.query.status || null;

  var schedules = await ScheduleService.findAllByIdBooking(
    idbooking,
    status,
    timedate,
    timehour
  );

  schedules = await Promise.all(
    schedules.map(async (schedule) => {
      var customer = await CustomerService.findCustomerByPhone(
        schedule.dataValues.phone
      );

      var factory = await FactoryService.findByID(
        schedule.dataValues.factoryid
      );

      const service = await ProductService.findByID(
        schedule.dataValues.serviceid
      );

      schedule.dataValues.customer = customer;
      schedule.dataValues.factory = factory;
      schedule.dataValues.service = service;

      return schedule;
    })
  );

  return res.status(200).json({
    results: schedules.length,
    data: schedules,
    status: true,
  });
};

exports.getSchedulesToday = async (req, res) => {
  var schedules = await ScheduleService.findAllSchedulesToday();

  schedules = await Promise.all(
    schedules.map(async (schedule) => {
      var customer = await CustomerService.findCustomerByPhone(
        schedule.dataValues.phone
      );

      var factory = await FactoryService.findByID(
        schedule.dataValues.factoryid
      );

      const service = await ProductService.findByID(
        schedule.dataValues.serviceid
      );

      schedule.dataValues.customer = customer;
      schedule.dataValues.factory = factory;
      schedule.dataValues.service = service;

      return schedule;
    })
  );

  return res.status(200).json({
    results: schedules.length,
    data: schedules,
    status: true,
  });
};

exports.getSchedulesBeforeToday = async (req, res) => {
  const setting = await SettingService.findAll();

  var schedules = await ScheduleService.findAllSchedulesBeforeToday(setting[0].reminderbefore);

  schedules = await Promise.all(
    schedules.map(async (schedule) => {
      var customer = await CustomerService.findCustomerByPhone(
        schedule.dataValues.phone
      );

      var factory = await FactoryService.findByID(
        schedule.dataValues.factoryid
      );

      const service = await ProductService.findByID(
        schedule.dataValues.serviceid
      );

      schedule.dataValues.customer = customer;
      schedule.dataValues.factory = factory;
      schedule.dataValues.service = service;

      return schedule;
    })
  );

  return res.status(200).json({
    results: schedules.length,
    data: schedules,
    status: true,
  });
};

exports.generateReminderCares = async (req, res) => {
  let idschedule = req.params.idschedule;
  let idservice = req.params.idservice;

  var note = req.body.note;

  var service = await ProductService.findByID(idservice);
  var schedule = await ScheduleService.findByID(idschedule);
  var bookingDetail = await BookingDetailService.findAllByIdBookingDetails(schedule.idbookingdetail);

  if (schedule.status !== STATUS.IN_PROCCESS) {
    return res.status(200).json({
      message: "Lần nhắc hỏi này đã được xác nhận",
      status: false,
    });
  }

  const currentDate = moment(schedule.timedate);

  if(service.category == CATEGORY.CHAM_DA) {
    var listcrmschedule = JSON.parse(service.crmschedule);

    console.log(listcrmschedule)

    if(listcrmschedule.length > 0) {
      var indexSession = 1;
      listcrmschedule.map(async (reminder) => {
        var numberDate = Number(reminder.date);
        const stage1EndDate = currentDate.clone().add(numberDate, "days").format("YYYY-MM-DD");
        await addReminderCare(schedule, stage1EndDate+" "+reminder.time , indexSession, reminder.content);
        indexSession++;
      })
    }

  } else {
    var distanceGenerate = service.distancegenerate;

    await ScheduleService.updateSchedule({ ...schedule, note: note, status: STATUS.SUCCESS }, idschedule);

    if(service.numbersesion == schedule.session) {
      await BookingDetailService.updateBookingDetail({...bookingDetail, status: STATUS.SUCCESS},bookingDetail.id)
    }

    // Tính toán số ngày giữa hai ngày
    //const totalDays = differenceInDays(endDate, startDate);

    await addReminderCare(schedule, schedule.timedate, 1, "");

    if (distanceGenerate > 7) {
      //var countReminder = setting[0].remindercarebelow;
      // Tính toán ngày bắt đầu và kết thúc của mỗi giai đoạn
      const stage1EndDate = currentDate.clone().add(Math.floor(distanceGenerate / 3), "days").format("YYYY-MM-DD");
      const stage2EndDate = currentDate.clone().add(Math.floor((distanceGenerate / 3) * 2), "days").format("YYYY-MM-DD");

      await addReminderCare(schedule, stage1EndDate, 2, "");
      await addReminderCare(schedule, stage2EndDate, 3, "");

    } else {
      const stage1EndDate = currentDate.clone().add(Math.floor((distanceGenerate / 2)), "days").format("YYYY-MM-DD");
      await addReminderCare(schedule, stage1EndDate, 2, "");
    }
  }
 
  return res.status(200).json({
    message: STATUS.SUCCESS,
    status: true,
  });
};

async function addReminderCare(schedule, date, sessionreminder, content) {
  var object = {
    ...schedule,
    idcustomer: schedule.idcustomer,
    idbookingdetail: schedule.idbookingdetail,
    idbooking: schedule.idbooking,
    session: schedule.session,
    phone: schedule.phone,
    note : content,
    factoryid: schedule.factoryid,
    idschedule: schedule.id,
    serviceid: schedule.serviceid,
    sessionreminder: sessionreminder,
    timedate: date,
    status: STATUS.IN_PROCCESS,
  }

  await ReminderCareService.createReminderCare(object)
}


exports.getReminderCrmToday = async (req, res) => {
  var reminders = await ReminderCareService.findAllRemindersToday();

  reminders = await Promise.all(
    reminders.map(async (reminder) => {
      var customer = await CustomerService.findCustomerByPhone(
        reminder.dataValues.phone
      );

      var factory = await FactoryService.findByID(
        reminder.dataValues.factoryid
      );

      const service = await ProductService.findByID(
        reminder.dataValues.serviceid
      );

      reminder.dataValues.customer = customer;
      reminder.dataValues.factory = factory;
      reminder.dataValues.service = service;

      return reminder;
    })
  );

  return res.status(200).json({
    results: reminders.length,
    data: reminders,
    status: true,
  });
};

exports.getReminderDetailByService = async (req, res) => {
  const idbookingdetail = req.params.idbookingdetail;
  var reminders = await ReminderCareService.findAllRemindersByService(idbookingdetail);

  reminders = await Promise.all(
    reminders.map(async (reminder) => {
      var customer = await CustomerService.findCustomerByPhone(
        reminder.dataValues.phone
      );

      var factory = await FactoryService.findByID(
        reminder.dataValues.factoryid
      );

      const service = await ProductService.findByID(
        reminder.dataValues.serviceid
      );

      reminder.dataValues.customer = customer;
      reminder.dataValues.factory = factory;
      reminder.dataValues.service = service;

      return reminder;
    })
  );

  return res.status(200).json({
    results: reminders.length,
    data: reminders,
    status: true,
  });
};



exports.confirmCRM = async (req, res) => {
  let idReminder = req.params.idReminder;

  var note = req.body.note;

  var reminder = await ReminderCareService.findByID(idReminder);
 

  if (reminder.status !== STATUS.IN_PROCCESS) {
    return res.status(200).json({
      message: "Lần nhắc hỏi này đã được xác nhận",
      status: false,
    });
  }

  await ReminderCareService.updateReminderCare({...reminder,note:note, status : STATUS.SUCCESS},idReminder);

  return res.status(200).json({
    message: STATUS.SUCCESS,
    status: true,
  });
};