const prisma = require("../../config/db.config")

class FavouriteService {

    /**
     * Add a property to a user's favourites.
     * Prisma's @@unique([userId, propertyId]) will throw P2002 on duplicates —
     * we surface that as a 409 so the controller can handle it cleanly.
     */
    create = async (data) => {
        try {
            // upsert-style: if the pair already exists return it, otherwise create
            return await prisma.favorite.upsert({
                where: {
                    userId_propertyId: {
                        userId: data.userId,
                        propertyId: data.propertyId,
                    },
                },
                update: {},          // no-op — record already exists
                create: data,
                include: {
                    property: {
                        select: {
                            id: true, title: true, price: true, status: true,
                            images: { where: { isPrimary: true }, take: 1 },
                        },
                    },
                },
            })
        } catch (exception) {
            throw exception
        }
    }

    /**
     * List favourites for the authenticated user with pagination.
     * @param {string} userId
     * @param {number} limit
     * @param {number} skip
     */
    index = async (userId, limit = 10, skip = 0) => {
        try {
            const [data, count] = await Promise.all([
                prisma.favorite.findMany({
                    where:    { userId },          // ← scoped to caller
                    skip,
                    take:     limit,
                    orderBy:  { createdAt: "desc" },
                    include: {
                        property: {
                            select: {
                                id: true, title: true, slug: true,
                                price: true, status: true,
                                propertyType: true, listingType: true,
                                bedrooms: true, bathrooms: true, areaSize: true,
                                location: {
                                    select: { city: true, country: true },
                                },
                                images: { where: { isPrimary: true }, take: 1 },
                            },
                        },
                    },
                }),
                prisma.favorite.count({ where: { userId } }),   // ← scoped count
            ])
            return { data, count }
        } catch (exception) {
            throw exception
        }
    }

    /**
     * Remove a favourite by its id, but only if it belongs to the caller.
     * Prevents one user from deleting another user's favourite.
     *
     * @param {string} id     - Favourite record id
     * @param {string} userId - Authenticated user (ownership check)
     */
    delete = async (id, userId) => {
        try {
            // Ownership check — findFirst returns null instead of throwing
            const existing = await prisma.favorite.findFirst({
                where: { id, userId },
            })
            if (!existing) throw { status: 404, message: "Favourite not found" }

            return await prisma.favorite.delete({ where: { id } })
        } catch (exception) {
            throw exception
        }
    }
}

module.exports = new FavouriteService()