const router = require("express").Router();
const authRouter = require("../module/auth/auth.router")
const userRouter = require("../module/user/user.router")
const agentRouter = require("../module/agents/agents.router")
const propertyRouter = require("../module/property/property.router")
const testimonialRouter = require("../module/testimonal/testimonal.router")
const blogRouter = require("../module/blogs/blogs.router")
const favoriteRouter = require("../module/favourite/favourite.router")
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