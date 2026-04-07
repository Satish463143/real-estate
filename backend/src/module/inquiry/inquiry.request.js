const Joi = require("joi")
const { InquiryStatus } = require("../../config/constant.config")

// ─────────────────────────────────────────────
//  Submit an inquiry (public + authenticated)
// ─────────────────────────────────────────────
const createInquiryDTO = Joi.object({
    propertyId: Joi.string().trim().required(),
    name:       Joi.string().trim().max(100).required(),
    email:      Joi.string().email().trim().lowercase().required(),
    phone:      Joi.string().trim().max(20).optional(),
    message:    Joi.string().trim().max(2000).required(),
})

// ─────────────────────────────────────────────
//  Admin: update inquiry status
// ─────────────────────────────────────────────
const updateInquiryStatusDTO = Joi.object({
    status: Joi.string().valid(...Object.values(InquiryStatus)).required(),
})

module.exports = {
    createInquiryDTO,
    updateInquiryStatusDTO,
}
