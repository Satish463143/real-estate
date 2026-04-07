const Joi = require('joi')

// propertyId is a cuid string, NOT a number
const favouriteCreateDTO = Joi.object({
    propertyId: Joi.string().trim().required(),
})

module.exports = {
    favouriteCreateDTO,
}
