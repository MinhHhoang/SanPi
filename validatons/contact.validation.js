const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        full_name: Joi.string().required(),
        email: Joi.string().required(),
        sdt: Joi.string().required(),
        content: Joi.string().required(),
    }),
}