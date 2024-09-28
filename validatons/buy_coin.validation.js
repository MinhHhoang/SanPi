const Joi = require("joi");


module.exports = {
  create: Joi.object().keys({
    type_coin: Joi.string().required(),
    count_coin :Joi.number().required(),
    wallet_coin :Joi.string().required(),
  }),
};


