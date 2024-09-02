const FactoryService = require('../services/factory.service');

exports.create = async (req, res) => {

    if (req.employeeCurrent.roleid === 'EMPLOYEE') {
        return res.status(400).json({
            message: 'Bạn không có quyền truy cập chức năng này.',
            status: false
        });
    }

    const factoryData = {
        name: req.body.name,
        active: 1
    }

    const factory = await FactoryService.createFactory(factoryData);
    return res.json({
        data: factory,
        message: 'Đăng ký mới cơ sở thành công',
        status: true
    });
}


exports.update = async (req, res) => {

    if (req.employeeCurrent.roleid === 'EMPLOYEE') {
        return res.status(400).json({
            message: 'Bạn không có quyền truy cập chức năng này.',
            status: false
        });
    }

    var factory = await FactoryService.findByID(req.params.id);

    const factoryData = {
        ...factory,
        name: req.body.name,
    }

    await FactoryService.updateFactory(factoryData, req.params.id);

    factory = await FactoryService.findByID(req.params.id);

    return res.json({
        data: factory,
        message: 'Cập nhật cơ sở thành công',
        status: true
    });
}

exports.delete = async (req, res) => {

    if (req.employeeCurrent.roleid === 'EMPLOYEE') {
        return res.status(400).json({
            message: 'Bạn không có quyền truy cập chức năng này.',
            status: false
        });
    }

    await FactoryService.deleteFactory(req.params.id);

    return res.json({
        message: 'Xóa cơ sở thành công.',
        status: true
    });
}


exports.getFactories = async (req, res) => {

    var factories = await FactoryService.findAll();

    var total = await FactoryService.getTotal();

    return res.status(200).json({
        results: factories.length,
        total: total,
        data: factories,
        status: true
    });
}

exports.setActive = async (req, res) => {

    if (req.employeeCurrent.roleid === 'EMPLOYEE') {
        return res.status(400).json({
            message: 'Bạn không có quyền truy cập chức năng này.',
            status: false
        });
    }

    var factory = await FactoryService.findByID(req.params.id);

    const factoryData = {
        ...factory,
        active: !product["active"],
    }

    await FactoryService.updateFactory(factoryData, req.params.id);

    return res.json({
        message: 'Cập nhật trạng thái cơ sở thành công.',
        status: true
    });
}


