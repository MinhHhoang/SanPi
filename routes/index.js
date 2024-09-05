const express = require('express');
const router = express.Router();

const ErrorHandler = require('../middleware/error.middleware');
const AuthGuard = require('../middleware/auth.middleware');
const validate = require('../utils/validator.util');

const AuthController = require('../controllers/employee.controller');
const NewController = require('../controllers/new.controller');
const GuidlineController = require('../controllers/guidline.controller');
const CoinController = require('../controllers/coin.controller');

const authValidate = require('../validatons/employee.validation');
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




router.all('*', (req, res) => res.status(400).json({ message: 'Bad Request.' }));


module.exports = router;
