const Joi = require('joi')

//when using joi we use data type first then other functions

    const signUpValidator = Joi.object({

        name: Joi.string().required().min(5),

        email: Joi.string().required().email(),

        password: Joi.string().required().min(7),

        confirmPassword: Joi.ref('password'),

        DOB: Joi.date().required()
    })

    const logInValidator = Joi.object({

        email: Joi.string().required().email(),

        password: Joi.string().required(),
    })

    const updateUserValidator = Joi.object({

        name: Joi.string().min(5),

        email: Joi.string().email(),

        password: Joi.string().min(7),

        age: Joi.number().integer().positive().greater(12)
    })

module.exports = {
    signUpValidator,
    logInValidator,
    updateUserValidator
}