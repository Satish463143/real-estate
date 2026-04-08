const { Role } = require('../../config/constant.config')
const loginCheck = require('../../middleware/auth.middlewares')
const hasPermission = require('../../middleware/rbac.middlewares')
const { bodyValidator } = require('../../middleware/validator.middlewares')
const propertyController = require('./property.controller')
const { createPropertyDTO, updatePropertyDTO } = require('./property.request')
const { uploadImage } = require('../../middleware/imageUpload.middleware')

const router = require('express').Router()

// Up to 10 property images uploaded under the field name "images"
const imageFields = [{ name: 'images', maxCount: 10 }]

router.route('/')
    // create property – admin only
    .post(
        loginCheck,
        hasPermission([Role.ADMIN]),
        ...uploadImage(imageFields),
        bodyValidator(createPropertyDTO),
        propertyController.create
    )
    // list all properties – admin only
    .get(loginCheck, hasPermission([Role.ADMIN]), propertyController.index)

router.route('/:id')
    // public: get single property
    .get(propertyController.showById)
    // admin only: update
    .put(
        loginCheck,
        hasPermission([Role.ADMIN]),
        ...uploadImage(imageFields),
        bodyValidator(updatePropertyDTO),
        propertyController.update
    )
    // admin only: delete
    .delete(loginCheck, hasPermission([Role.ADMIN]), propertyController.delete)

// Public listing for home page (ACTIVE / SOLD / RENTED only)
router.get('/listForHome', propertyController.listForHome)

module.exports = router