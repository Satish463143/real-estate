const testimonalService = require('./testimonal.service')

class TestimonalController {
    testimonals

    createTestimonal = async (req, res, next) => {
        try {
            const data = req.body
            const testimonial = await testimonalService.createTestimonial(data)
            res.status(201).json({
                details: testimonial,
                message: 'Testimonial created successfully',
                meta: null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    index = async (req, res, next) => {
        try {
            const limit = parseInt(req.query.limit) || 10
            const page  = parseInt(req.query.page)  || 1
            const skip  = (page - 1) * limit

            // Prisma where filter – use 'contains' for search
            const filter = {}
            if (req.query.search) {
                filter.name = { contains: req.query.search, mode: 'insensitive' }
            }

            const { count, testimonials } = await testimonalService.listAll({ filter, limit, skip })

            res.json({
                details: testimonials,
                message: 'Testimonials fetched successfully',
                meta: { total: count, page, limit },
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    // Private validation – checks the record exists by Prisma cuid id
    #validate = async (id) => {
        if (!id) throw { status: 400, message: 'Testimonial ID is required' }
        this.testimonals = await testimonalService.getByFilter({ id })
        if (!this.testimonals) throw { status: 404, message: 'Testimonial not found' }
    }

    showById = async (req, res, next) => {
        try {
            await this.#validate(req.params.id)
            res.json({
                details: this.testimonals,
                message: 'Testimonial fetched successfully',
                meta: null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    updateTestimonial = async (req, res, next) => {
        try {
            await this.#validate(req.params.id)
            const data = req.body

            // If the PATCH/PUT didn't include a new image, drop the key so Prisma
            // doesn't try to overwrite the stored bytes with undefined.
            if (!data.image) delete data.image

            const updated = await testimonalService.updateTestimonial(req.params.id, data)
            res.json({
                details: updated,
                message: 'Testimonial updated successfully',
                meta: null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    deleteTestimonial = async (req, res, next) => {
        try {
            await this.#validate(req.params.id)
            const deleted = await testimonalService.deleteTestimonial(req.params.id)
            res.json({
                details: deleted,
                message: 'Testimonial deleted successfully',
                meta: null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
}

module.exports = new TestimonalController()