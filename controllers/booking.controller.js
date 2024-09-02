const BookingService = require("../services/booking.service");
const CustomerService = require("../services/customer.service");
const ProductService = require("../services/product.service");
const FactoryService = require("../services/factory.service");
const ScheduleService = require("../services/schedule.service");
const BookingDetailService = require("../services/bookingdetail.service");
const ReminderCareService = require("../services/remindercare.service");
const { STATUS } = require("../constant");

exports.create = async (req, res) => {
  const bookingData = {
    idcustomer: req.body.idcustomer,
    phone: req.body.phone,
    note: req.body.note,
    factoryid: req.body.factoryid,
    services: req.body.services,
    timedate: req.body.timedate,
    timehour: req.body.timehour,
    status: STATUS.IN_PROCCESS, // CONFIRMED, DESTROY
  };

  var booking = await BookingService.createBooking(bookingData);

  var customer = await CustomerService.findCustomerByPhone(
    booking.dataValues.phone
  );

  var factory = await FactoryService.findByID(booking.dataValues.factoryid);

  booking.dataValues.customer = customer;
  booking.dataValues.factory = factory;

  var listService = [];

  var services = booking.dataValues.services
    .slice(1, -1)
    .split(",")
    .map((item) => parseInt(item));

  for (let index = 0; index < services.length; index++) {
    const service = await ProductService.findByID(services[index]);
    listService.push(service);
  }

  booking.dataValues.listService = listService;

  return res.json({
    data: booking,
    message: "Đặt lịch hẹn thành công.",
    status: true,
  });
};

exports.update = async (req, res) => {
  let booking = await BookingService.findByID(req.params.id);

  if (!booking) {
    return res.json({
      message: "Lịch hẹn không tồn tại.",
      status: false,
    });
  }

  const bookingData = {
    ...booking,
    note: req.body.note,
    services: req.body.services,
    status: req.body.status, // CONFIRMED, DESTROYED, IN_PROCCESS
  };

  await BookingService.updateBooking(bookingData, req.params.id);

  booking = await BookingService.findByID(req.params.id);

  var listService = [];

  var services = booking.dataValues.services
    .slice(1, -1)
    .split(",")
    .map((item) => parseInt(item));

  for (let index = 0; index < services.length; index++) {
    const service = await ProductService.findByID(services[index]);
    listService.push(service);
  }

  booking.dataValues.listService = listService;

  return res.json({
    data: booking,
    message: "Cập nhật lịch hẹn thành công.",
    status: true,
  });
};

exports.destroyBooking = async (req, res) => {
  let idbooking = req.body.idbooking;

  const booking = await BookingService.findByID(idbooking);

  await BookingService.updateBooking(
    { ...booking, status: STATUS.DESTROYED },
    idbooking
  );

  return res.status(200).json({
    message: STATUS.DESTROYED,
    status: true,
  });
};

exports.getBookings = async (req, res) => {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var query = req.query.query || "";
  var timedate = req.query.timedate || null;
  var timehour = req.query.timehour || null;
  var status = req.query.status || null;

  var bookings = await BookingService.findAll(
    page,
    limit,
    query,
    status,
    timedate,
    timehour
  );
  var statistics = await BookingService.getStatistics(
    query,
    timedate,
    timehour
  );

  bookings = await Promise.all(
    bookings.map(async (booking) => {
      var customer = await CustomerService.findCustomerByPhone(
        booking.dataValues.phone
      );

      var factory = await FactoryService.findByID(booking.dataValues.factoryid);

      booking.dataValues.customer = customer;
      booking.dataValues.factory = factory;

      var listService = [];

      var services = booking.dataValues.services
        .slice(1, -1)
        .split(",")
        .map((item) => parseInt(item));

      for (let index = 0; index < services.length; index++) {
        const service = await ProductService.findByID(services[index]);
        listService.push(service);
      }

      booking.dataValues.listService = listService;

      return booking;
    })
  );

  var total = await BookingService.getTotal(query, status, timedate, timehour);

  return res.status(200).json({
    results: bookings.length,
    total: total,
    data: bookings,
    statistics: statistics,
    status: true,
  });
};

exports.getBookingsDetail = async (req, res) => {
  var idbooking = req.params.idbooking;
  var timedate = req.query.timedate || null;
  var timehour = req.query.timehour || null;
  var status = req.query.status || null;

  var bookingDetails = await BookingDetailService.findAllByIdBooking(
    idbooking,
    status,
    timedate,
    timehour
  );

  bookingDetails = await Promise.all(
    bookingDetails.map(async (bookingDetail) => {
      var customer = await CustomerService.findCustomerByPhone(
        bookingDetail.dataValues.phone
      );

      var factory = await FactoryService.findByID(
        bookingDetail.dataValues.factoryid
      );

      const service = await ProductService.findByID(
        bookingDetail.dataValues.service
      );

      bookingDetail.dataValues.customer = customer;
      bookingDetail.dataValues.factory = factory;
      bookingDetail.dataValues.service = service;

      var listSchedule = await ScheduleService.findAllByIdBookingDetailService(
        bookingDetail.dataValues.id,
        status,
        timedate,
        timehour
      );

      bookingDetail.dataValues.dataSchedule = listSchedule;

      return bookingDetail;
    })
  );

  return res.status(200).json({
    results: bookingDetails.length,
    data: bookingDetails,
    status: true,
  });
};

exports.getAllBookingsDetail = async (req, res) => {
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var query = req.query.query || "";
  var timedate = req.query.timedate || null;
  var timehour = req.query.timehour || null;
  var status = req.query.status || null;

  var bookingDetails = await BookingDetailService.findAll(
    page,
    limit,
    query,
    status,
    timedate,
    timehour
  );

  var statistics = await BookingDetailService.getStatistics(
    query,
    timedate,
    timehour
  );

  bookingDetails = await Promise.all(
    bookingDetails.map(async (bookingDetail) => {
      var customer = await CustomerService.findCustomerByPhone(
        bookingDetail.dataValues.phone
      );

      var factory = await FactoryService.findByID(
        bookingDetail.dataValues.factoryid
      );

      const service = await ProductService.findByID(
        bookingDetail.dataValues.service
      );

      bookingDetail.dataValues.customer = customer;
      bookingDetail.dataValues.factory = factory;
      bookingDetail.dataValues.service = service;

      var listSchedule = await ScheduleService.findAllByIdBookingDetailService(
        bookingDetail.dataValues.id,
        status,
        timedate,
        timehour
      );

      bookingDetail.dataValues.dataSchedule = listSchedule;

      return bookingDetail;
    })
  );

  var total = await BookingDetailService.totalCount(
    query,
    status,
    timedate,
    timehour
  );

  return res.status(200).json({
    results: bookingDetails.length,
    data: bookingDetails,
    total: total,
    statistics: statistics,
    status: true,
  });
};

exports.destroyServiceByBooking = async (req, res) => {
  let idbookingdetail = req.params.idbookingdetail;
  var note = req.body.note;

  var originalBookingDetails;
  var originalSchedules;
  var originalReminder;

  try {
    const bookingDetails = await BookingDetailService.findAllByIdBookingDetails(
      idbookingdetail
    );

    if (bookingDetails.status == STATUS.DESTROYED) {
      return res.status(200).json({
        message: "Dịch vụ này đã được hủy trước đó, vui lòng kiểm tra lại",
        status: true,
      });
    }

    // Store the original booking details before update
    originalBookingDetails = { ...bookingDetails };

    await BookingDetailService.updateBookingDetail(
      { ...bookingDetails, note: note, status: STATUS.DESTROYED },
      idbookingdetail
    );

    var listSchedule = await ScheduleService.findAllByIdBookingDetailService(
      idbookingdetail,
      null,
      null,
      null
    );

    // Store original schedules before update
    originalSchedules = listSchedule.map((schedule) => ({ ...schedule }));

    listSchedule = await Promise.all(
      listSchedule.map(async (schedule) => {
        if (schedule.status == STATUS.IN_PROCCESS) {
          await ScheduleService.updateSchedule(
            { ...schedule, note: note, status: STATUS.DESTROYED },
            schedule.id
          );
        }
        return schedule;
      })
    );

    var listReminerCare = await ReminderCareService.findAllRemindersByService(
      idbookingdetail
    );

    // Store original schedules before update
    originalReminder = listReminerCare.map((reminder) => ({ ...reminder }));

    listReminerCare = await Promise.all(
      listReminerCare.map(async (reminder) => {
        if (reminder.status == STATUS.IN_PROCCESS) {
          await ReminderCareService.updateReminderCare(
            { ...reminder, note: note, status: STATUS.DESTROYED },
            reminder.id
          );
        }
        return reminder;
      })
    );

    return res.status(200).json({
      message: STATUS.DESTROYED,
      status: true,
    });
  } catch (error) {
    // Rollback changes if an error occurs

    // Rollback booking details update
    if (originalBookingDetails) {
      await BookingDetailService.updateBookingDetail(
        originalBookingDetails,
        idbookingdetail
      );
    }

    // Rollback schedule updates
    if (originalSchedules && originalSchedules.length > 0) {
      await Promise.all(
        originalSchedules.map(async (schedule) => {
          await ScheduleService.updateSchedule(schedule, schedule.id);
        })
      );
    }

    // Rollback schedule updates
    if (originalReminder && originalReminder.length > 0) {
      await Promise.all(
        originalReminder.map(async (reminder) => {
          await ReminderCareService.updateReminderCare(reminder, reminder.id);
        })
      );
    }

    // Return error response
    return res.status(500).json({
      message: "An error occurred while processing the request.",
      status: false,
      error: error.message, // Optionally, you can include the error message for debugging
    });
  }
};
