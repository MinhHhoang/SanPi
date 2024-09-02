const Joi = require("joi");

module.exports = {
  update: Joi.object().keys({
    logo: Joi.string().required(),
    numberPhone: Joi.string().required(),
    nameBanner: Joi.string().required(),
    colorone: Joi.string().required(),
    colortwo: Joi.string().required(),
    colorthree: Joi.string().required(),
    reminderbefore: Joi.number().required(),
  }),
};
