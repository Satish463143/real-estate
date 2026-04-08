const router = require('express').Router()
const loginCheck = require('../../middleware/auth.middleware')
const hasPermission = require('../../middleware/rbac.middleware')
const blogsController = require('./blogs.controller')
const {bodyvalidator} = require('../../middleware/validator.middleware')
const blogsDTO = require('./blogs.request')
const { uploadImage } = require('../../middleware/imageUpload.middleware')
const { Role } = require('../../config/constant.config')

const imageFields = [
    { name: 'thumbnail', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 },
    { name: 'authorAvatar', maxCount: 1 }
]

router.route('/')
    .post(loginCheck, hasPermission([Role.ADMIN]),
        ...uploadImage(imageFields), 
        bodyvalidator(blogsDTO), blogsController.createBlogs)
    .get(blogsController.index)

router.route('/:id')
    .get(blogsController.showById)
    .put(loginCheck, hasPermission([Role.ADMIN]), 
        ...uploadImage(imageFields), 
        bodyvalidator(blogsDTO), blogsController.updateBlogs)
    .delete(loginCheck, hasPermission([Role.ADMIN]), blogsController.deleteBlogs)

router.route('/:id/like')
    .post(blogsController.likeBlogs)

router.route('/:id/view')
    .post(blogsController.viewBlogs)

module.exports = router