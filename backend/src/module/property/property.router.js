const { Role } = require('../../config/constant.config')
const loginCheck = require('../../middleware/auth.middlewares')
const hasPermission = require('../../middleware/rbac.middlewares')
const { bodyValidator } = require('../../middleware/validator.middlewares')
const propertyController = require('./property.controller')
const { createPropertyDTO, updatePropertyDTO } = require('./property.request')

const router = require('express').Router()

router.route('/')
    .post(loginCheck, hasPermission([Role.ADMIN]),bodyValidator(createPropertyDTO), propertyController.create)
    .get(loginCheck, hasPermission([Role.ADMIN]), propertyController.index)

router.route('/:id')
    .get( propertyController.showById)
    .put(loginCheck, hasPermission([Role.ADMIN]),bodyValidator(updatePropertyDTO), propertyController.update)
    .delete(loginCheck, hasPermission([Role.ADMIN]), propertyController.delete)

router.get('/listForHome',propertyController.listForHome)

module.exports = router