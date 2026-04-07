const { Role } = require('../../config/constant.config')
const loginCheck = require('../../middleware/auth.middlewares')
const hasPermission = require('../../middleware/rbac.middlewares')
const { bodyValidator } = require('../../middleware/validator.middlewares')
const propertyController = require('./property.controller')
const { createPropertyDTO, updatePropertyDTO } = require('./property.request')

const router = require('express').Router()


router.route('/')
    // create property only admin can create
    .post(loginCheck, hasPermission([Role.ADMIN]),bodyValidator(createPropertyDTO), propertyController.create)
    // get all properties only admin can get
    .get(loginCheck, hasPermission([Role.ADMIN]), propertyController.index)

router.route('/:id')
    // get property by id for user
    .get( propertyController.showById)
    // update property only admin can update
    .put(loginCheck, hasPermission([Role.ADMIN]),bodyValidator(updatePropertyDTO), propertyController.update)
    // delete property only admin can delete
    .delete(loginCheck, hasPermission([Role.ADMIN]), propertyController.delete)


//fetech only properties which status are ACTIVE,SOLD,RENTED for user
router.get('/listForHome',propertyController.listForHome)

module.exports = router