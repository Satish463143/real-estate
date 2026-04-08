const propertyService = require('./property.service')

class PropertyController {

    create = async (req, res, next) => {
        try {
            const response = await propertyService.create(req.body)
            res.status(201).json({
                result:  response,
                message: 'Property created successfully',
                meta:    null,
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

            const filter = {}
            if (req.query.search) {
                filter.OR = [
                    { title:       { contains: req.query.search, mode: 'insensitive' } },
                    { description: { contains: req.query.search, mode: 'insensitive' } },
                    { location:    { city:    { contains: req.query.search, mode: 'insensitive' } } },
                ]
            }

            const { data, count } = await propertyService.index(limit, skip, filter)
            res.json({
                result:  data,
                message: 'Properties fetched successfully',
                meta: {
                    currentPage: page,
                    total:       count,
                    limit,
                    totalPages:  Math.ceil(count / limit),
                },
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    #validate = async (id) => {
        if (!id) throw { status: 400, message: 'Property id is required' }
        const property = await propertyService.getPropertyById(id)
        if (!property) throw { status: 404, message: 'Property not found' }
        return property
    }

    showById = async (req, res, next) => {
        try {
            const property = await this.#validate(req.params.id)
            res.json({
                result:  property,
                message: 'Property fetched successfully',
                meta:    null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    update = async (req, res, next) => {
        try {
            const property = await this.#validate(req.params.id)
            const response = await propertyService.update(property.id, req.body)
            res.json({
                result:  response,
                message: 'Property updated successfully',
                meta:    null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    delete = async (req, res, next) => {
        try {
            const property = await this.#validate(req.params.id)
            const response = await propertyService.delete(property.id)
            res.json({
                result:  response,
                message: 'Property deleted successfully',
                meta:    null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    listForHome = async (req, res, next) => {
        try {
            const limit = parseInt(req.query.limit) || 10
            const page  = parseInt(req.query.page)  || 1
            const skip  = (page - 1) * limit

            const { data, count } = await propertyService.listForHome(req.query, limit, skip)
            res.json({
                result:  data,
                message: 'Properties fetched successfully',
                meta: {
                    currentPage: page,
                    total:count,
                    limit: limit,
                },
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
}

module.exports = new PropertyController()
