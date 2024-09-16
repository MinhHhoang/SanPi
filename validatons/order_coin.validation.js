const Joi = require("joi");


module.exports = {
  create: Joi.object().keys({
    type_order: Joi.string().required(),
    type_coin: Joi.string().required(),
    price_coin_current :Joi.number().allow(null),
    stk :Joi.string().allow("").allow(null),
    stk_bank :Joi.string().allow("").allow(null),
    stk_name :Joi.string().allow("").allow(null),
    total_money :Joi.number().allow(null),
    wallet_coin :Joi.string().allow("").allow(null),
  }),
};


