const { Role } = require('../../config/constant.config')
const loginCheck = require('../../middleware/auth.middlewares')
const hasPermission = require('../../middleware/rbac.middlewares')
const { bodyValidator } = require('../../middleware/validator.middlewares')
const agentsController = require('./agents.controller')

const router = require('express').Router()


router.route('/')
    .post(loginCheck, hasPermission([Role.ADMIN]),bodyValidator(), agentsController.create)
    .get(loginCheck, hasPermission([Role.ADMIN]), agentsController.index)

router.route('/:id')
    .get(loginCheck, hasPermission([Role.ADMIN]), agentsController.showById)
    .put(loginCheck, hasPermission([Role.ADMIN]),bodyValidator(), agentsController.update)
    .delete(loginCheck, hasPermission([Role.ADMIN]), agentsController.delete)

module.exports = router