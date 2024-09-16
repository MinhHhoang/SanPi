const Joi = require("joi");


module.exports = {
  create: Joi.object().keys({
    type_order: Joi.string().required(),
    type_coin: Joi.string().required(),
  }),
  
};


