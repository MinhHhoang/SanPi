const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        name: Joi.string().required(),
        image : Joi.string().required(),
        sodu: Joi.number().required(),
        giamua: Joi.number().required(),
        giaban: Joi.number().required(),
        address_pay: Joi.string().required()
    }),
}