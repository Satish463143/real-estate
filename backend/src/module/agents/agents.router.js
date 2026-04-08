const { Role } = require('../../config/constant.config')
const loginCheck = require('../../middleware/auth.middlewares')
const hasPermission = require('../../middleware/rbac.middlewares')
const { bodyValidator } = require('../../middleware/validator.middlewares')
const agentsController = require('./agents.controller')
const router = require('express').Router()
const { uploadImage } = require('../../middleware/imageUpload.middleware')
const { agentCreateDTO, agentUpdateDTO } = require('./agents.request')

const imageFields = [{ name: 'avatarUrl', maxCount: 1 }]

router.route('/')
    .post(loginCheck, hasPermission([Role.ADMIN]),
        ...uploadImage(imageFields),
        bodyValidator(agentCreateDTO), agentsController.create)
    .get(loginCheck, hasPermission([Role.ADMIN]), agentsController.index)

router.route('/:id')
    .get(loginCheck, hasPermission([Role.ADMIN]), agentsController.showById)
    .put(loginCheck, hasPermission([Role.ADMIN]),
        ...uploadImage(imageFields),
        bodyValidator(agentUpdateDTO), agentsController.update)
    .delete(loginCheck, hasPermission([Role.ADMIN]), agentsController.delete)

module.exports = router