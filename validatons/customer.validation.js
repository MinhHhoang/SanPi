const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        phone: Joi.string().required(),
        codepin: Joi.string().min(6).max(6).required(),
        fullname : Joi.string().allow("", null),
        email : Joi.string().allow("", null),
        address : Joi.string().allow("", null),
        image : Joi.string().allow("", null),
    }),
    login: Joi.object().keys({
        phone: Joi.string().required(),
        codepin: Joi.string().min(6).max(6).required()
    }),
    update: Joi.object().keys({
        phone: Joi.string().required(),
        fullname : Joi.string().allow("", null),
        email : Joi.string().allow("", null),
        address : Joi.string().allow("", null),
        image : Joi.string().allow("", null),
    }),
}