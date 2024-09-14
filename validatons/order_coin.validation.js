const Joi = require("joi");


module.exports = {
  create: Joi.object().keys({
    status_order: Joi.string().email().required(),
    type_order: Joi.string().required(),
    type_coin: Joi.string().required(),
  }),
  
};


