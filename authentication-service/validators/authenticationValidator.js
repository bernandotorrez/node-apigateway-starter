const Joi = require('@hapi/joi');
const BadRequestError = require('../exceptions/BadRequestError');
const { convertMessage } = require('../utils/globalFunction');

const LoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const LoginValidator = (payload) => {
  const validationResult = LoginSchema.validate(payload, { abortEarly: false });

  if (validationResult.error) {
    const error = JSON.stringify(convertMessage(validationResult.error.details));
    throw new BadRequestError(error);
  }
};

const RegisterSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const RegisterValidator = (payload) => {
  const validationResult = RegisterSchema.validate(payload, { abortEarly: false });

  if (validationResult.error) {
    const error = JSON.stringify(convertMessage(validationResult.error.details));
    throw new BadRequestError(error);
  }
};

module.exports = {
  LoginValidator,
  RegisterValidator
};
