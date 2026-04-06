const loginCheck = require("../../middleware/auth.middlewares");
const verifyToken = require("../../middleware/validateToken.middleware");
const { bodyValidator } = require("../../middleware/validator.middlewares");
const authController = require("./auth.controller");
const { loginSchema, changePasswordSchema } = require("./auth.request");

const router = require("express").Router();

router.post('/login', bodyValidator(loginSchema), authController.login);

router.get('/me', loginCheck, authController.getLoggedInUser);


module.exports = router;
