const Joi = require('@hapi/joi');
const BadRequestError = require('../exceptions/BadRequestError');

const LoginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

const LoginValidator = (payload) => {
    const validationResult = LoginSchema.validate(payload);

    if(validationResult.error) {
        throw new BadRequestError(validationResult.error.message);
    }
}

const RegisterSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

const RegisterValidator = (payload) => {
    const validationResult = RegisterSchema.validate(payload);

    if(validationResult.error) {
        throw new BadRequestError(validationResult.error.message);
    }
}

module.exports = {
    LoginValidator,
    RegisterValidator
}