const router = require('express').Router()
const loginCheck = require('../../middleware/auth.middleware')
const hasPermission = require('../../middleware/rbac.middleware')
const testimonialController = require('./testimonal.controller')
const { bodyvalidator } = require('../../middleware/validator.middleware')
const testimonialDTO = require('./testimonal.request')
const { uploadImage } = require('../../middleware/imageUpload.middleware')
const { Role } = require('../../config/constant.config')

// image field definition – reused on POST and PUT
const imageFields = [{ name: 'image', maxCount: 1 }]

router.route('/')
    .post(
        loginCheck,
        hasPermission([Role.ADMIN]),
        ...uploadImage(imageFields),       
        bodyvalidator(testimonialDTO),
        testimonialController.createTestimonal
    )
    .get(testimonialController.index)

router.route('/:id')
    .get(loginCheck, hasPermission([Role.ADMIN]), testimonialController.showById)
    .put(
        loginCheck,
        hasPermission([Role.ADMIN]),
        ...uploadImage(imageFields),
        bodyvalidator(testimonialDTO),
        testimonialController.updateTestimonial
    )
    .delete(loginCheck, hasPermission([Role.ADMIN]), testimonialController.deleteTestimonial)

module.exports = router