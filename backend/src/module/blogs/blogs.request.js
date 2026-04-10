const joi = require('joi')

const blogsDTO = joi.object({
    title: joi.string().required(),
    subtitle: joi.string().required(),
    thumbnail:    joi.any().required(),   // Buffer – validated by multer
    heroImage:    joi.any().required(),   // Buffer – validated by multer
    category: joi.string().required(),
    date: joi.date().required(),
    readTime: joi.string().required(),
    isFeatured: joi.boolean().required(),    
    authorName: joi.string().required(),
    authorBio: joi.string().required(),
    authorAvatar: joi.any().optional().allow(null),  // Buffer – validated by multer
    content: joi.string().required(),
})

module.exports = blogsDTO