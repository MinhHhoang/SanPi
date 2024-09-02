const SettingService = require('../services/setting.service');

exports.update = async (req, res) => {

    if (req.employeeCurrent.roleid === 'EMPLOYEE') {
        return res.status(400).json({
            message: 'Bạn không có quyền truy cập chức năng này.',
            status: false
        });
    }

    const settingData = {
        logo: req.body.logo,
        numberPhone: req.body.numberPhone,
        nameBanner: req.body.nameBanner,
        colorone: req.body.colorone,
        colortwo: req.body.colortwo,
        colorthree: req.body.colorthree,
        reminderbefore: req.body.reminderbefore,
        remindercarebelow: req.body.remindercarebelow,
        remindercaretop: req.body.remindercaretop
    }

    await SettingService.updateSetting(settingData);

    var settings = await SettingService.findAll();

    return res.json({
        data: settings[0],
        message: 'Cập nhật web source thành công',
        status: true
    });
}



exports.getSetting = async (req, res) => {

    // if (req.employeeCurrent.roleid === 'EMPLOYEE') {
    //     return res.status(400).json({
    //         message: 'Bạn không có quyền truy cập chức năng này.',
    //         status: false
    //     });
    // }

    var setting = await SettingService.findAll();

    return res.status(200).json({
        data: setting[0],
        status: true
    });
}

