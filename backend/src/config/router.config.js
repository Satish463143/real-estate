const router = require("express").Router();
const authRouter = require("../module/auth/auth.router")
const userRouter = require("../module/user/user.router")


router.use('/auth', authRouter)
router.use('/user', userRouter)




module.exports = router;