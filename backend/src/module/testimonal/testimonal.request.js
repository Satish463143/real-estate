const Joi = require('joi')

const testimonalDTO = Joi.object({
    name:   Joi.string().min(3).max(100).required(),
    review: Joi.string().min(10).required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    image:  Joi.any().required(),
}).unknown(false)

module.exports = testimonalDTO