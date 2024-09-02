const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        name: Joi.string().required(),
        image: Joi.string().required(),
        category: Joi.string().required(),
        time: Joi.string().required(),
        numbersesion:Joi.number().required(),
        distancegenerate:Joi.number().required(),
        price: Joi.number().required(),
        content: Joi.string().allow("", null),
        crmschedule : Joi.string().allow("", null),
    }),
}