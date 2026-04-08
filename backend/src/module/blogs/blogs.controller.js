const blogsService = require('./blogs.service')
const slugify = require('slugify')

class BlogsController{
    blogsDetails;
    createBlogs = async (req, res,next) => {
        try{
            const data = req.body

            data.slug = slugify(data.title, { lower: true, strict: true })

            const blogs = await blogsService.createBlogs(data)
            res.json({
                meta:null,
                message: "Blogs created successfully",
                result: blogs
            })
        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }
    index = async (req, res,next) => {
        try{
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10
            const skip = (page - 1) * limit
            const filter = {}
            if(req.query.search){
                filter.title = { contains: req.query.search, mode: 'insensitive' }
            }
            const {count, blogs} = await blogsService.index({filter, limit, skip})
            res.json({
                details:blogs,
                message:"Blogs fetched successfully",
                meta:{
                    total:count,
                    page:page,
                    limit:limit
                }
            })
        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }
    #validate = async (id) => {
        try{
            if(!id){
                throw {status:400, message:"Blogs ID is required"}
            }
            this.blogsDetails = await blogsService.getIdByFilter({id})
            if(!this.blogsDetails){
                throw {status:404, message:"Blogs not found"}
            }
        }catch(exception){
            console.log(exception);
            throw exception
        }
    }
    showById = async (req, res,next) => {
        try{
            const id = req.params.id
            await this.#validate(id)
            res.json({
                details:this.blogsDetails,
                message:"Blogs fetched successfully",
                meta:null
            })

        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }
    updateBlogs = async (req, res, next) => {
        try {
            const id = req.params.id
            await this.#validate(id)
            const data = req.body

            // Regenerate slug if the title is being updated
            if (data.title) {
                data.slug = slugify(data.title, { lower: true, strict: true })
            }

            // Drop any image keys that weren't uploaded (multer sets them as
            // Buffer; if absent the key is undefined and Prisma would error)
            for (const field of ['thumbnail', 'heroImage', 'authorAvatar']) {
                if (!data[field]) delete data[field]
            }

            const blogs = await blogsService.updateBlogs(id, data)
            res.json({
                details: blogs,
                message: 'Blogs updated successfully',
                meta: null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
    deleteBlogs = async (req, res,next) => {
        try{
            const id = req.params.id
            await this.#validate(id)
            await blogsService.deleteBlogs(id)
            res.json({
                meta:null,
                message:"Blogs deleted successfully",
                result:null
            })
        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }
    likeBlogs = async (req, res,next) => {
        try{
            const id = req.params.id
            await this.#validate(id)
            const blogs = await blogsService.likeBlogs(id)
            res.json({
                details:blogs,
                message:"Blogs liked successfully",
                meta:null
            })

        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }
    viewBlogs = async (req, res,next) => {
        try{
            const id = req.params.id
            await this.#validate(id)
            const blogs = await blogsService.viewBlogs(id)
            res.json({
                details:blogs,
                message:"Blogs viewed successfully",
                meta:null
            })
        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }

}
module.exports = new BlogsController()