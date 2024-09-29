const Joi = require("joi");
const { updateBanking } = require("../controllers/customer.controller");
const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/);

const validatePassword = (value) => {
  if (!passwordRegex.test(String(value))) {
    throw new Error(
      "Password should contains a lowercase, a uppercase character and a digit."
    );
  }
};

module.exports = {
  create: Joi.object().keys({
    email: Joi.string().email().required(),
    full_name: Joi.string().required(),
    phone: Joi.string().required(),
    ref_email: Joi.string().email().allow(null, "").optional(),
    password: Joi.string().required(),
  }),
  update: Joi.object().keys({
    image: Joi.string().allow("").allow(null),
    full_name_bank: Joi.string().allow("").allow(null),
    stk: Joi.string().allow("").allow(null),
    name_bank: Joi.string().allow("").allow(null),
    full_name: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
  }),
  updateBanking: Joi.object().keys({
    full_name_bank: Joi.string().required(),
    stk: Joi.string().required(),
    name_bank: Joi.string().required(),
  }),

  update_wallet_pi: Joi.object().keys({
    wallet_pi: Joi.string().allow("").allow(null),
  }),
  update_wallet_sidra: Joi.object().keys({
    wallet_sidra: Joi.string().allow("").allow(null),
  }),
  login: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
