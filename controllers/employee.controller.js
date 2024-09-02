const AuthService = require('../services/employee.service');
const jwtConfig = require('../config/jwt.config');
const bcryptUtil = require('../utils/bcrypt.util');
const jwtUtil = require('../utils/jwt.util');


exports.create = async (req, res) => {
    const isExist = await AuthService.findEmployeeByEmail(req.body.email);
    if (isExist) {
        return res.status(400).json({
            message: 'Tài khoản email này đã tồn tại'
        });
    }

    console.log("empData")
    const hashedPassword = await bcryptUtil.createHash(req.body.password);

    const empData = {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        image: req.body.image,
        roleid: req.body.roleid,
        active: 1,
        password: hashedPassword,
    }

    console.log(empData)
    const employee = await AuthService.createEmployee(empData);
    return res.json({
        data: employee,
        message: 'Tạo mới nhân viên thành công.'
    });
}

exports.login = async (req, res) => {
    const employee = await AuthService.findEmployeeByEmail(req.body.email);
    if (employee) {
        const isMatched = await bcryptUtil.compareHash(req.body.password, employee.password);
        if (isMatched && employee.active == 1) {
            const token = await jwtUtil.createToken({ id: employee.id, username: employee.username, roleid : employee.roleid });
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

    if (req.employeeCurrent.roleid === 'EMPLOYEE') {
        return res.status(400).json({
            message: 'Bạn không có quyền truy cập chức năng này.',
            status: false
        });
    }


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
    console.log(req.employeeCurrent.roleid)

    if (req.employeeCurrent.roleid === 'EMPLOYEE') {
        return res.status(400).json({
            message: 'Bạn không có quyền truy cập chức năng này.',
            status: false
        });
    }

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
        username: employee.username,
        email: employee.email,
        phone : employee.phone,
        image: employee.image,
        active: employee.active,
        roleid: employee.roleid,
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

exports.updateEmployee = async (req, res) => {

    if (req.employeeCurrent.roleid === 'EMPLOYEE') {
        return res.status(400).json({
            message: 'Không có quyền sử dụng chức năng này.',
            status: false
        });
    }

    let employee = await AuthService.findEmployeeByEmail(req.body.email);

    let hashedPassword = req.body.password;
    if (employee.password !== req.body.password) {
        hashedPassword = await bcryptUtil.createHash(req.body.password);
    }

    const empData = {
        username: req.body.username,
        email: req.body.email,
        phone : req.body.phone,
        image: req.body.image,
        active: req.body.active,
        roleid: req.body.roleid,
        password: hashedPassword,
    };

    await AuthService.updateEmployee(empData, req.params.id);

    employee = await AuthService.findEmployeeByEmail(req.body.email);

    return res.json({
        data: employee,
        message: 'Cập nhật nhân viên thành công.',
        status: true
    });
}


exports.setActive = async (req, res) => {

    let employee = await AuthService.findEmployeeById(req.params.id);

    const empData = {
        ...employee,
        active: !employee["active"],
    }

    await AuthService.updateEmployee(empData, req.params.id);

    return res.json({
        message: 'Cập nhật trạng thái nhân viên thành công.',
        status: true
    });
}