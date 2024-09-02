const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        idcustomer: Joi.number().required(),
        factoryid: Joi.number().required(),
        phone: Joi.string().required(),
        note : Joi.string().allow("", null),
        services : Joi.string().required(),
        timedate : Joi.string().required(),
        timehour : Joi.string().required(),
    }),
}