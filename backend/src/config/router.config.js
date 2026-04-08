const router = require("express").Router();
const authRouter = require("../module/auth/auth.router")
const userRouter = require("../module/user/user.router")
const agentRouter = require("../module/agent/agent.router")
const propertyRouter = require("../module/property/property.router")
const testimonialRouter = require("../module/testimonial/testimonial.router")
const blogRouter = require("../module/blog/blog.router")
const favoriteRouter = require("../module/favorite/favorite.router")
const inquiryRouter = require("../module/inquiry/inquiry.router")


router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/agent', agentRouter)
router.use('/property', propertyRouter)
router.use('/testimonial', testimonialRouter)
router.use('/blogs', blogRouter)
router.use('/favorite', favoriteRouter)
router.use('/inquiry', inquiryRouter)


module.exports = router;