const Joi = require("joi")

const addressSchema = Joi.object({
    country: Joi.string().default("Nepal"),
    province: Joi.string().required(),
    district: Joi.string().required(),
    fullAddress: Joi.string().required(),
})

const addressOptionalSchema = Joi.object({
    country: Joi.string().default("Nepal"),
    province: Joi.string().optional(),
    district: Joi.string().optional(),
    fullAddress: Joi.string().optional(),
})

const userCreateDTO = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().optional(),
    profileImage: Joi.string().optional(), 
    address: addressSchema.required(),
})

const userUpdateDTO = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().optional(),
    phone: Joi.string().optional(),
    profileImage: Joi.string().optional(), 
    address: addressOptionalSchema.optional(),
})


module.exports = {
    userCreateDTO,
    userUpdateDTO,
}