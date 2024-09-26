const Joi = require('joi');

module.exports = {
    create: Joi.object().keys({
        title: Joi.string().allow("").allow(null),
        image: Joi.string().allow("").allow(null),
        content: Joi.string().required(),
        video_url: Joi.string().allow("").allow(null),
    }),
}