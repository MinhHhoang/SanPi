const AuthService = require('../services/employee.service');
const jwtConfig = require('../config/jwt.config');
const bcryptUtil = require('../utils/bcrypt.util');
const jwtUtil = require('../utils/jwt.util');
const { ROLEID } = require("../constant");


exports.create = async (req, res) => {
    const isExist = await AuthService.findEmployeeByEmail(req.body.email);
    if (isExist) {
        return res.status(400).json({
            message: 'Tài khoản email này đã tồn tại'
        });
    }

    const hashedPassword = await bcryptUtil.createHash(req.body.password);

    const empData = {
        email: req.body.email,
        roleid: ROLEID.EMPLOYEE,
        password: hashedPassword,
    }

    const employee = await AuthService.createEmployee(empData);
    return res.json({
        data: employee,
        message: 'Tạo mới nhân viên thành công.'
    });
}

exports.delete = async (req, res) => {
 
    await AuthService.delete(req.params.id);
  
    return res.json({
      message: "Xóa thành công.",
      status: true,
    });
  };

exports.login = async (req, res) => {
    const employee = await AuthService.findEmployeeByEmail(req.body.email);
    if (employee) {
        const isMatched = await bcryptUtil.compareHash(req.body.password, employee.password);
        if (isMatched ) {
            const token = await jwtUtil.createToken({...employee});
            return res.json({
                employee: employee,
                access_token: token,
                token_type: 'Bearer',
                expires_in: jwtConfig.ttl,
                status : true
            });
        }
    }
    return res.status(400).json({ message: 'Đăng nhập không thành công', status: false });
}

exports.getEmployeeByID = async (req, res) => {
    const employee = await AuthService.findEmployeeById(req.params.id);
    return res.json({
        data: employee,
        message: 'Success.'
    });
}

exports.logout = async (req, res) => {
    await AuthService.logoutEmployee(req.token, req.employeeCurrent.exp);
    return res.json({ message: 'Đăng xuất tài khoản thành công' });
}

exports.getEmployees = async (req, res) => {

    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var query = req.query.query || "";

    var employees = await AuthService.findAll(page, limit, query);
    var total = await AuthService.getTotal();

    return res.status(200).json({
        results: employees.length,
        total: total,
        data: employees,
        status: true
    });
}

exports.changePassword = async (req, res) => {

    let employee = await AuthService.findEmployeeByEmail(req.body.email);

    let hashedPassword = req.body.password;
    if (employee.password !== req.body.password) {
        hashedPassword = await bcryptUtil.createHash(req.body.password);
    }

    const empData = {
        ...employee,
        password: hashedPassword,
    };

    await AuthService.updateEmployee(empData, req.params.id);

    employee = await AuthService.findEmployeeByEmail(req.body.email);

    return res.json({
        data: employee,
        message: "Đổi mật khẩu thành công.",
        status: true,
    });
};

