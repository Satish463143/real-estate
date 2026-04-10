const router = require('express').Router()
const loginCheck = require('../../middleware/auth.middlewares')
const hasPermission = require('../../middleware/rbac.middlewares')
const testimonialController = require('./testimonal.controller')
const testimonialDTO = require('./testimonal.request')
const { uploadImage } = require('../../middleware/imageUpload.middleware')
const { Role } = require('../../config/constant.config')
const { bodyValidator } = require('../../middleware/validator.middlewares')

// image field definition – reused on POST and PUT
const imageFields = [{ name: 'image', maxCount: 1 }]

router.route('/')
    .post(
        loginCheck,
        hasPermission([Role.ADMIN]),
        ...uploadImage(imageFields),       
        bodyValidator(testimonialDTO),
        testimonialController.createTestimonal
    )
    .get(testimonialController.index)

router.route('/:id')
    .get(loginCheck, hasPermission([Role.ADMIN]), testimonialController.showById)
    .put(
        loginCheck,
        hasPermission([Role.ADMIN]),
        ...uploadImage(imageFields),
        bodyValidator(testimonialDTO),
        testimonialController.updateTestimonial
    )
    .delete(loginCheck, hasPermission([Role.ADMIN]), testimonialController.deleteTestimonial)

module.exports = router