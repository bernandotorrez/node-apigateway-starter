const Joi = require('@hapi/joi');
const BadRequestError = require('../exceptions/BadRequestError');
const { convertMessage } = require('../utils/globalFunction');

const AuthSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(5).required()
});

const AuthValidator = (payload) => {
  const validationResult = AuthSchema.validate(payload, { abortEarly: false });

  if (validationResult.error) {
    const error = JSON.stringify(convertMessage(validationResult.error.details));
    throw new BadRequestError(error);
  }
};

module.exports = {
  AuthValidator
};
