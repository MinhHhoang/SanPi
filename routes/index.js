const express = require('express');
const router = express.Router();

const ErrorHandler = require('../middleware/error.middleware');
const AuthGuard = require('../middleware/auth.middleware');
const validate = require('../utils/validator.util');

const AuthController = require('../controllers/employee.controller');
const CustomerController = require('../controllers/customer.controller');
const NewController = require('../controllers/new.controller');
const GuidlineController = require('../controllers/guidline.controller');
const CoinController = require('../controllers/coin.controller');

const authValidate = require('../validatons/employee.validation');
const CustomerValidate = require('../validatons/customer.validation');
const NewValidate = require('../validatons/new.validation');
const GuidlineValidate = require('../validatons/guidline.validation');
const CoinValidate = require('../validatons/coin.validation');


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

//Coin
router.post('/coin/create', AuthGuard, validate(CoinValidate.create), ErrorHandler(CoinController.create));
router.put('/coin/:id', AuthGuard, validate(CoinValidate.create), ErrorHandler(CoinController.update));
router.delete('/coin/:id', AuthGuard, ErrorHandler(CoinController.delete));
router.get('/coin', ErrorHandler(CoinController.getObjects));
router.get('/coin', ErrorHandler(CoinController.getObjectById));

//Customer
router.post('/customer/create', validate(CustomerValidate.create), ErrorHandler(CustomerController.create));
router.post('/customer/login', validate(CustomerValidate.login), ErrorHandler(CustomerController.login));
router.get('/customer/logout', AuthGuard, ErrorHandler(CustomerController.logout));
router.get('/customer/search', AuthGuard, ErrorHandler(CustomerController.getCustomers));
router.get('/customer/:id', AuthGuard, ErrorHandler(CustomerController.getCustomerID));
router.put('/customer/changepassword/:id', AuthGuard, ErrorHandler(CustomerController.changePassword));
router.put('/customer/:id', AuthGuard, validate(CoinValidate.create), ErrorHandler(CustomerController.update));




router.all('*', (req, res) => res.status(400).json({ message: 'Bad Request.' }));


module.exports = router;
