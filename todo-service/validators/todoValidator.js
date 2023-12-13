const Joi = require('@hapi/joi');
const BadRequestError = require('../exceptions/BadRequestError');

const TodoSchema = Joi.object({
    uuid: Joi.string(),
    todo_name: Joi.string().min(3).required(),
    status: Joi.number(),
    is_active: Joi.number()
})

const CreateTodoValidator = (payload) => {
    const validationResult = TodoSchema.validate(payload);

    if(validationResult.error) {
        throw new BadRequestError(validationResult.error.message);
    }
}

module.exports = {
    CreateTodoValidator
}