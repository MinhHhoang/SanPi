const Service = require('../services/customer.service');
const jwtConfig = require('../config/jwt.config');
const bcryptUtil = require('../utils/bcrypt.util');
const jwtUtil = require('../utils/jwt.util');


exports.create = async (req, res) => {
    const isExist = await Service.findByEmail(req.body.email);
    if (isExist) {
        return res.status(400).json({
            message: 'Tài khoản email này đã tồn tại'
        });
    }

    const hashedPassword = await bcryptUtil.createHash(req.body.password);

    const object = {
        email: req.body.email,
        full_name: req.body.full_name,
        phone: req.body.phone,
        ref_email: req.body.ref_email,
        password: hashedPassword,
    }

    const customer = await Service.create(object);



    return res.json({
        data: customer,
        message: 'Tạo mới thành công.'
    });
}


exports.update = async (req, res) => {

    var result = await Service.findById(req.params.id);

    const object = {
        ...result,
        image: req.body.image,
        full_name: req.body.full_name,
        phone: req.body.phone,

    }

    await Service.update(object, req.params.id);

    return res.json({
        data: result,
        message: "Cập nhật thành công.",
        status: true,
    });
};


exports.updateBanking = async (req, res) => {

    var result = await Service.findById(req.params.id);


    if (result.email !== req.employeeCurrent.email) {
        return res.status(400).json({
            message: 'Bạn không có quyền update tài khoản này',
            status: false
        });
    }

    const object = {
        ...result,
        full_name_bank: req.body.full_name_bank,
        stk: req.body.stk,
        name_bank: req.body.name_bank,

    }

    await Service.update(object, req.params.id);

    return res.json({
        data: result,
        message: "Cập nhật thành công.",
        status: true,
    });
};


exports.updateWalletPi = async (req, res) => {

    var result = await Service.findById(req.params.id);


    if (result.email !== req.employeeCurrent.email) {
        return res.status(400).json({
            message: 'Bạn không có quyền update tài khoản này',
            status: false
        });
    }

    const object = {
        ...result,
        wallet_pi: req.body.wallet_pi,
    }

    await Service.update(object, req.params.id);

    return res.json({
        data: result,
        message: "Cập nhật thành công.",
        status: true,
    });
};


exports.updateWalletSidra = async (req, res) => {

    var result = await Service.findById(req.params.id);


    if (result.email !== req.employeeCurrent.email) {
        return res.status(400).json({
            message: 'Bạn không có quyền update tài khoản này',
            status: false
        });
    }

    const object = {
        ...result,
        wallet_sidra: req.body.wallet_sidra,
    }

    await Service.update(object, req.params.id);

    return res.json({
        data: result,
        message: "Cập nhật thành công.",
        status: true,
    });
};

exports.login = async (req, res) => {
    const customer = await Service.findByEmail(req.body.email);
    if (customer) {
        const isMatched = await bcryptUtil.compareHash(req.body.password, customer.password);
        if (isMatched) {
            const token = await jwtUtil.createToken({ ...customer });
            return res.json({
                customer: customer,
                access_token: token,
                token_type: 'Bearer',
                expires_in: jwtConfig.ttl,
                status: true
            });
        }
    }
    return res.status(400).json({ message: 'Đăng nhập không thành công', status: false });
}

exports.getCustomerID = async (req, res) => {
    const customer = await Service.findById(req.params.id);
    return res.json({
        data: customer,
        message: 'Success.',
        status: true
    });
}

exports.logout = async (req, res) => {
    await Service.logout(req.token, req.employeeCurrent.exp);
    return res.json({ message: 'Đăng xuất tài khoản thành công' });
}

exports.getCustomers = async (req, res) => {

    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var query = req.query.query || "";

    var customers = await Service.findAll(page, limit, query);
    var total = await Service.getTotal(query);

    return res.status(200).json({
        results: customers.length,
        total: total,
        data: customers,
        status: true
    });
}

exports.changePassword = async (req, res) => {

    let customer = await Service.findByEmail(req.body.email);

    let hashedPassword = req.body.password;
    if (customer.password !== req.body.password) {
        hashedPassword = await bcryptUtil.createHash(req.body.password);
    }

    const object = {
        ...customer,
        password: hashedPassword,
    };

    await Service.update(object, req.params.id);

    customer = await Service.findByEmail(req.body.email);

    return res.json({
        data: customer,
        message: "Đổi mật khẩu thành công.",
        status: true,
    });
};

