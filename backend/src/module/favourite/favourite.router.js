const loginCheck = require("../../middleware/auth.middlewares")
const { bodyValidator } = require("../../middleware/validator.middlewares")
const favouriteController = require("./favourite.controller")
const { favouriteCreateDTO } = require("./favourite.request")
const router = require("express").Router()

router.route('/')
    .post(loginCheck, bodyValidator(favouriteCreateDTO), favouriteController.create)
    .get(loginCheck,  favouriteController.index)

router.delete('/:id',loginCheck,  favouriteController.delete)

module.exports = router