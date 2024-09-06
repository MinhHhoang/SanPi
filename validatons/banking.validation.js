const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        customer_id : Joi.number().required(),
        name_bank: Joi.string().required(),
        stk: Joi.string().required(),
        full_name: Joi.string().required(),
    }),
}