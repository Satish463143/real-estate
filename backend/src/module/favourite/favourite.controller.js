const favouriteService = require("./favourite.service")

class FavouriteController {

    create = async (req, res, next) => {
        try {
            // get user from auth middleware
            const user = req.authUser
            // merge validated body (propertyId) with the authenticated userId
            const response = await favouriteService.create({
                ...req.body,
                userId: user.id,
            })
            res.status(201).json({
                result:  response,
                message: "Added to favourites",
                meta:    null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }

    index = async (req, res, next) => {
        try {
            const limit = parseInt(req.query.limit, 10) || 10
            const page  = parseInt(req.query.page,  10) || 1
            const skip  = (page - 1) * limit

            const { data, count } = await favouriteService.index(req.authUser.id, limit, skip)

            res.json({
                result:  data,
                message: "Favourites fetched successfully",
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

    delete = async (req, res, next) => {
        try {
            // pass userId so service can enforce ownership
            const response = await favouriteService.delete(req.params.id, req.authUser.id)
            res.json({
                result:  response,
                message: "Removed from favourites",
                meta:    null,
            })
        } catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
}

module.exports = new FavouriteController()