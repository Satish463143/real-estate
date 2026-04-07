const prisma = require("../../config/db.config")

// Lean property snapshot returned alongside every inquiry
const PROPERTY_SELECT = {
    id:          true,
    title:       true,
    slug:        true,
    price:       true,
    status:      true,
    listingType: true,
    location: { select: { city: true, country: true } },
}

class InquiryService {

    /**
     * Submit a new inquiry.
     * Works for both guests (userId = null) and authenticated users.
     *
     * @param {object} data - Validated body + optional userId
     */
    create = async (data) => {
        try {
            return await prisma.inquiry.create({
                data,
                include: {
                    property: { select: PROPERTY_SELECT },
                },
            })
        } catch (exception) {
            throw exception
        }
    }

    /**
     * Admin: list all inquiries with pagination + optional filters.
     * Indexed columns (propertyId, status, email, createdAt) are used
     * directly in where clauses — no full-table scans.
     *
     * @param {object} filters - { propertyId, status, email, search }
     * @param {number} limit
     * @param {number} skip
     */
    index = async (filters = {}, limit = 10, skip = 0) => {
        try {
            const { propertyId, status, email, search } = filters

            const where = {}
            if (propertyId) where.propertyId = propertyId
            if (status)     where.status     = status.toUpperCase()
            if (email)      where.email       = { equals: email, mode: "insensitive" }
            if (search) {
                where.OR = [
                    { name:    { contains: search, mode: "insensitive" } },
                    { email:   { contains: search, mode: "insensitive" } },
                    { message: { contains: search, mode: "insensitive" } },
                ]
            }

            const [data, count] = await Promise.all([
                prisma.inquiry.findMany({
                    where,
                    skip,
                    take:     limit,
                    orderBy:  { createdAt: "desc" },
                    include: {
                        property: { select: PROPERTY_SELECT },
                        user:     { select: { id: true, name: true, email: true } },
                    },
                }),
                prisma.inquiry.count({ where }),
            ])

            return { data, count }
        } catch (exception) {
            throw exception
        }
    }

    /**
     * Authenticated user: list only their own inquiries.
     *
     * @param {string} userId
     * @param {number} limit
     * @param {number} skip
     */
    myInquiries = async (userId, limit = 10, skip = 0) => {
        try {
            const [data, count] = await Promise.all([
                prisma.inquiry.findMany({
                    where:   { userId },
                    skip,
                    take:    limit,
                    orderBy: { createdAt: "desc" },
                    include: {
                        property: { select: PROPERTY_SELECT },
                    },
                }),
                prisma.inquiry.count({ where: { userId } }),
            ])
            return { data, count }
        } catch (exception) {
            throw exception
        }
    }

    /**
     * Get a single inquiry by id.
     * Throws 404 if not found.
     */
    getById = async (id) => {
        try {
            const inquiry = await prisma.inquiry.findUnique({
                where: { id },
                include: {
                    property: { select: PROPERTY_SELECT },
                    user:     { select: { id: true, name: true, email: true } },
                },
            })
            if (!inquiry) throw { status: 404, message: "Inquiry not found" }
            return inquiry
        } catch (exception) {
            throw exception
        }
    }

    /**
     * Admin: update the status of an inquiry (NEW → IN_PROGRESS → CLOSED).
     *
     * @param {string} id     - Inquiry id
     * @param {string} status - New status value
     */
    updateStatus = async (id, status) => {
        try {
            // Existence check — findUnique is O(1) on PK
            const existing = await prisma.inquiry.findUnique({ where: { id }, select: { id: true } })
            if (!existing) throw { status: 404, message: "Inquiry not found" }

            return await prisma.inquiry.update({
                where: { id },
                data:  { status },
                include: {
                    property: { select: PROPERTY_SELECT },
                },
            })
        } catch (exception) {
            throw exception
        }
    }

    /**
     * Admin: hard-delete an inquiry.
     */
    delete = async (id) => {
        try {
            const existing = await prisma.inquiry.findUnique({ where: { id }, select: { id: true } })
            if (!existing) throw { status: 404, message: "Inquiry not found" }

            return await prisma.inquiry.delete({ where: { id } })
        } catch (exception) {
            throw exception
        }
    }
}

module.exports = new InquiryService()
