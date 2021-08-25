const Joi = require('@hapi/joi');
const BadRequestError = require('../exceptions/BadRequestError');

const AddTaskSchema = Joi.object({
    task: Joi.string().required(),
})

const AddTaskValidator = (payload) => {
    const validationResult = AddTaskSchema.validate(payload);

    if(validationResult.error) {
        throw new BadRequestError(validationResult.error.message);
    }
}

module.exports = {
    AddTaskValidator
}