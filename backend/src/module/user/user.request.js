const Joi = require("joi")



const userCreateDTO = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().optional(),
    avatarUrl: Joi.string().optional(), 
})

const userUpdateDTO = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
    avatarUrl: Joi.string().optional(), 
})


module.exports = {
    userCreateDTO,
    userUpdateDTO,
}