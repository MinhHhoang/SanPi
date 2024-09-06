const Joi = require('joi');
const passwordRegex = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/);

const validatePassword = (value) => {  
    if(!passwordRegex.test(String(value))) { 
        throw new Error('Password should contains a lowercase, a uppercase character and a digit.')
    }
}

module.exports = {
    create: Joi.object().keys({
        email: Joi.string().email().required(),
        full_name: Joi.string().required(),
        phone: Joi.string().email().required(),
        ref_email: Joi.string().email().required(),
        password: Joi.string().min(8).max(16).required().external(validatePassword)
    }),
    update: Joi.object().keys({
        image: Joi.string().allow("").allow(null),
        full_name: Joi.string().required(),
        phone: Joi.string().email().required(),
    }),
    login: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
}