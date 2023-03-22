const Joi = require('joi')

const createTaskValidator = Joi.object({

    title: Joi.string().required(),

    description: Joi.string().required() ,

    completed: Joi.boolean() ,

})
const updateTaskValidator = Joi.object({

    title: Joi.string(),

    description: Joi.string() ,

    completed: Joi.boolean() ,

})
module.exports = {
    updateTaskValidator,
    createTaskValidator
}