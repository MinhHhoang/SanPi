const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        title: Joi.string().required(),
        image: Joi.string().required(),
        content: Joi.string().required(),
    }),
}