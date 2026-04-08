const prisma = require('../../config/db.config')
const slugify = require('slugify')

// ── Bytes → base64 data-URI ───────────────────────────────────────────────────
const toBase64 = (buf, mime = 'image/jpeg') =>
    buf ? `data:${mime};base64,${Buffer.from(buf).toString('base64')}` : null

// Serialize a single PropertyImage row
const serializeImage = (img) => ({
    id:        img.id,
    altText:   img.altText,
    isPrimary: img.isPrimary,
    sortOrder: img.sortOrder,
    createdAt: img.createdAt,
    image:     toBase64(img.image),
})

// Serialize a full Property record (with images relation already included)
const serialize = (property) => {
    if (!property) return null
    return {
        ...property,
        images: Array.isArray(property.images)
            ? property.images.map(serializeImage)
            : [],
    }
}

// ── Default include for all reads ─────────────────────────────────────────────
const DEFAULT_INCLUDE = {
    location: true,
    images:   { orderBy: { sortOrder: 'asc' } },
    features: true,
    agent:    { select: { id: true, firstName: true, lastName: true, phone: true, avatarUrl: true } },
}

class PropertyService {

    // ── CREATE ────────────────────────────────────────────────────────────────
    create = async (data) => {
        try {
            // Extract image buffers uploaded by the middleware (array or absent)
            const imageBuffers = Array.isArray(data.images) ? data.images : []
            delete data.images           // remove from data – handled via nested write

            // Extract nested location + features from body
            const { location, features, agentId, ...propertyData } = data

            const property = await prisma.property.create({
                data: {
                    ...propertyData,
                    slug: slugify(propertyData.title),
                    agent: { connect: { id: agentId } },
                    location: {
                        create: location,
                    },
                    features: features?.length
                        ? { create: features }
                        : undefined,
                    images: imageBuffers.length
                        ? {
                            create: imageBuffers.map((buffer, idx) => ({
                                image:     buffer,
                                isPrimary: idx === 0,   // first image is primary
                                sortOrder: idx,
                            })),
                          }
                        : undefined,
                },
                include: DEFAULT_INCLUDE,
            })

            return serialize(property)
        } catch (exception) {
            throw exception
        }
    }

    // ── INDEX (admin) ─────────────────────────────────────────────────────────
    index = async (limit = 10, skip = 0, filter = {}) => {
        try {
            const [data, count] = await Promise.all([
                prisma.property.findMany({
                    where:   filter,
                    skip,
                    take:    parseInt(limit),
                    orderBy: { createdAt: 'desc' },
                    include: DEFAULT_INCLUDE,
                }),
                prisma.property.count({ where: filter }),
            ])
            return { data: data.map(serialize), count }
        } catch (exception) {
            throw exception
        }
    }

    // ── GET BY ID ─────────────────────────────────────────────────────────────
    getPropertyById = async (id) => {
        try {
            const property = await prisma.property.findUnique({
                where:   { id },
                include: DEFAULT_INCLUDE,
            })
            return serialize(property)
        } catch (exception) {
            throw exception
        }
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    update = async (id, data) => {
        try {
            // Pull new images from body (may be absent on partial updates)
            const imageBuffers = Array.isArray(data.images) ? data.images : []
            delete data.images

            const { location, features, agentId, ...propertyData } = data

            if (propertyData.title) {
                propertyData.slug = slugify(propertyData.title)
            }

            const property = await prisma.property.update({
                where: { id },
                data: {
                    ...propertyData,
                    ...(agentId ? { agent: { connect: { id: agentId } } } : {}),
                    ...(location ? { location: { update: location } } : {}),
                    ...(features
                        ? {
                            features: {
                                deleteMany: {},           // replace all features
                                create: features,
                            },
                          }
                        : {}),
                    // Append new images without removing existing ones
                    ...(imageBuffers.length
                        ? {
                            images: {
                                create: imageBuffers.map((buffer, idx) => ({
                                    image:     buffer,
                                    isPrimary: false,
                                    sortOrder: idx,
                                })),
                            },
                          }
                        : {}),
                },
                include: DEFAULT_INCLUDE,
            })

            return serialize(property)
        } catch (exception) {
            throw exception
        }
    }

    // ── DELETE ────────────────────────────────────────────────────────────────
    delete = async (id) => {
        try {
            // PropertyImages are cascade-deleted via schema onDelete: Cascade
            const property = await prisma.property.delete({
                where:   { id },
                include: DEFAULT_INCLUDE,
            })
            return serialize(property)
        } catch (exception) {
            throw exception
        }
    }

    // ── PUBLIC LISTING (home page) ────────────────────────────────────────────
    listForHome = async (filters = {}, limit = 10, skip = 0) => {
        try {
            const {
                search,
                propertyType,
                listingType,
                status,
                minPrice,
                maxPrice,
                bedrooms,
                bathrooms,
                minArea,
                maxArea,
                yearBuilt,
                isFeatured,
                furnishingStatus,
                sortBy    = 'createdAt',
                sortOrder = 'desc',
            } = filters

            // Only show public-safe statuses
            const ALLOWED_STATUSES = ['ACTIVE', 'SOLD', 'RENTED']
            const statusFilter = status && ALLOWED_STATUSES.includes(status.toUpperCase())
                ? status.toUpperCase()
                : { in: ALLOWED_STATUSES }

            const where = { status: statusFilter }

            // Full-text search across property + location fields
            if (search) {
                where.OR = [
                    { title:       { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { location:    { city:    { contains: search, mode: 'insensitive' } } },
                    { location:    { country: { contains: search, mode: 'insensitive' } } },
                ]
            }

            if (propertyType)    where.propertyType    = propertyType.toUpperCase()
            if (listingType)     where.listingType     = listingType.toUpperCase()
            if (furnishingStatus) where.furnishingStatus = furnishingStatus.toUpperCase()

            if (isFeatured !== undefined)
                where.isFeatured = isFeatured === 'true' || isFeatured === true

            if (minPrice || maxPrice) {
                where.price = {}
                if (minPrice) where.price.gte = parseFloat(minPrice)
                if (maxPrice) where.price.lte = parseFloat(maxPrice)
            }

            if (bedrooms)  where.bedrooms  = { gte: parseInt(bedrooms, 10) }
            if (bathrooms) where.bathrooms = { gte: parseInt(bathrooms, 10) }

            if (minArea || maxArea) {
                where.areaSize = {}
                if (minArea) where.areaSize.gte = parseFloat(minArea)
                if (maxArea) where.areaSize.lte = parseFloat(maxArea)
            }

            if (yearBuilt) where.yearBuilt = parseInt(yearBuilt, 10)

            const SORTABLE = ['createdAt', 'price', 'bedrooms', 'bathrooms', 'areaSize', 'yearBuilt', 'isFeatured']
            const orderBy  = {
                [SORTABLE.includes(sortBy) ? sortBy : 'createdAt']: sortOrder === 'asc' ? 'asc' : 'desc',
            }

            const [data, count] = await Promise.all([
                prisma.property.findMany({
                    where,
                    skip,
                    take: parseInt(limit),
                    orderBy,
                    include: {
                        location: true,
                        // Only the primary image for list cards
                        images:   { where: { isPrimary: true }, take: 1 },
                        features: true,
                        agent:    { select: { id: true, firstName: true, lastName: true } },
                    },
                }),
                prisma.property.count({ where }),
            ])

            return { data: data.map(serialize), count }
        } catch (exception) {
            throw exception
        }
    }
}



module.exports = new PropertyService()