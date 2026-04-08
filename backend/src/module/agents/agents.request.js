const Joi = require("joi")


const agentCreateDTO = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    avatarUrl: Joi.any().optional(),
})

const agentUpdateDTO = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    avatarUrl: Joi.any().optional(),
})

module.exports = {
    agentCreateDTO,
    agentUpdateDTO,
}