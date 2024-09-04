const express = require('express');
const router = express.Router();

const ErrorHandler = require('../middleware/error.middleware');
const AuthGuard = require('../middleware/auth.middleware');
const CustomerGuard = require('../middleware/customer.middleware');
const validate = require('../utils/validator.util');

const AuthController = require('../controllers/employee.controller');
const NewController = require('../controllers/new.controller');
const GuidlineController = require('../controllers/guidline.controller');
const ProductController = require('../controllers/product.controller');
const CustomerController = require('../controllers/customer.controller');
const BookingController = require('../controllers/booking.controller');
const ScheduleController = require('../controllers/schedule.controller');
const SettingController = require('../controllers/setting.controller');
const DashboardController = require('../controllers/dashboard.controller');

const authValidate = require('../validatons/employee.validation');
const NewValidate = require('../validatons/new.validation');
const GuidlineValidate = require('../validatons/guidline.validation');
const ProductValidate = require('../validatons/guidline.validation');
const CustomerValidate = require('../validatons/customer.validation');
const BookingValidate = require('../validatons/booking.validation');
const SettingValidate = require('../validatons/setting.validation');


// Dashboard
router.get('/dashboard', AuthGuard, ErrorHandler(DashboardController.getDashboard));
//Employee
router.post('/employee/create', AuthGuard, validate(authValidate.create), ErrorHandler(AuthController.create));
router.post('/login', validate(authValidate.login), ErrorHandler(AuthController.login));
router.get('/logout', AuthGuard, ErrorHandler(AuthController.logout));
router.get('/employee/search', AuthGuard, ErrorHandler(AuthController.getEmployees));
router.get('/employee/:id', AuthGuard, ErrorHandler(AuthController.getEmployeeByID));
router.put('/employee/changepassword/:id', AuthGuard, ErrorHandler(AuthController.changePassword));


//News
router.post('/new/create', AuthGuard, validate(NewValidate.create), ErrorHandler(NewController.create));
router.put('/new/:id', AuthGuard, validate(NewValidate.create), ErrorHandler(NewController.update));
router.delete('/new/:id', AuthGuard, ErrorHandler(NewController.delete));
router.get('/new', ErrorHandler(NewController.getObjects));
router.get('/news', ErrorHandler(NewController.getObjectById));

//Guidline
router.post('/guidline/create', AuthGuard, validate(GuidlineValidate.create), ErrorHandler(GuidlineController.create));
router.put('/guidline/:id', AuthGuard, validate(GuidlineValidate.create), ErrorHandler(GuidlineController.update));
router.delete('/guidline/:id', AuthGuard, ErrorHandler(GuidlineController.delete));
router.get('/guidline', ErrorHandler(GuidlineController.getObjects));
router.get('/guidline', ErrorHandler(GuidlineController.getObjectById));


//Guidline
router.post('/product/create', AuthGuard, validate(ProductValidate.create), ErrorHandler(ProductController.create));
router.put('/product/:id', AuthGuard, validate(ProductValidate.create), ErrorHandler(ProductController.update));
router.delete('/product/:id', AuthGuard, ErrorHandler(ProductController.delete));
router.get('/product/search', ErrorHandler(ProductController.getProducts));
router.get('/product/active/search', CustomerGuard, ErrorHandler(ProductController.getProductsActive));
router.get('/product/:id', ErrorHandler(ProductController.getProductById));
router.put('/product/active/:id', AuthGuard, ErrorHandler(ProductController.setActive));


//Customer
router.post('/customer/create', validate(CustomerValidate.create), ErrorHandler(CustomerController.create));
router.put('/customer/:id', AuthGuard, validate(CustomerValidate.update), ErrorHandler(CustomerController.update));
router.get('/customer/search', AuthGuard, ErrorHandler(CustomerController.getCustomers));
router.get('/customer/:id', AuthGuard, ErrorHandler(CustomerController.getCustomerById));
router.get('/customer/check/:phone', ErrorHandler(CustomerController.checkCustomerIsNotExist));
router.put('/customer/active/:id', AuthGuard, ErrorHandler(CustomerController.setActive));
router.put('/customer/changepin/:id', AuthGuard, ErrorHandler(CustomerController.changeCodePin));
router.post('/customer/login', validate(CustomerValidate.login), ErrorHandler(CustomerController.login));
router.get('/customer/history/:idcustomer', AuthGuard, ErrorHandler(CustomerController.getHistoryBooking));


//Booking
router.post('/booking/create', CustomerGuard, validate(BookingValidate.create), ErrorHandler(BookingController.create));
router.put('/booking/:id', AuthGuard, validate(BookingValidate.update), ErrorHandler(BookingController.update));
router.get('/booking/search', AuthGuard, ErrorHandler(BookingController.getBookings));

router.post('/booking/generate', AuthGuard, ErrorHandler(ScheduleController.generateSchedule));
router.post('/booking/destroy', AuthGuard, ErrorHandler(BookingController.destroyBooking));


router.get('/bookingdetail/:idbooking', AuthGuard, ErrorHandler(BookingController.getBookingsDetail));
router.get('/bookingdetail', AuthGuard, ErrorHandler(BookingController.getAllBookingsDetail));
router.put('/bookingdetail/destroyservice/:idbookingdetail', AuthGuard, ErrorHandler(BookingController.destroyServiceByBooking));


//Schedule
router.get('/schedule/search/:idbooking', AuthGuard, ErrorHandler(ScheduleController.getSchedules));
router.get('/schedule/today', AuthGuard, ErrorHandler(ScheduleController.getSchedulesToday));
router.get('/schedule/reminder', AuthGuard, ErrorHandler(ScheduleController.getSchedulesBeforeToday));
router.get('/schedule/remindercare', AuthGuard, ErrorHandler(ScheduleController.getReminderCrmToday));
router.get('/schedule/remindercare/:idbookingdetail', AuthGuard, ErrorHandler(ScheduleController.getReminderDetailByService));
router.post('/schedule/reminder/:idschedule/:idservice', AuthGuard, ErrorHandler(ScheduleController.generateReminderCares));
router.put('/schedule/remindercare/confirm/:idReminder', AuthGuard, ErrorHandler(ScheduleController.confirmCRM));


//setting
router.put('/setting', AuthGuard, validate(SettingValidate.update), ErrorHandler(SettingController.update));
router.get('/setting',  ErrorHandler(SettingController.getSetting));

router.all('*', (req, res) => res.status(400).json({ message: 'Bad Request.' }));


module.exports = router;
