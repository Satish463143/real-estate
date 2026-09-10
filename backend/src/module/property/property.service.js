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
            const ALLOWED_STATUSES = ['active', 'sold', 'rented']
            const statusFilter = status && ALLOWED_STATUSES.includes(status.toLowerCase())
                ? status.toLowerCase()
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

            if (propertyType)    where.propertyType    = propertyType.toLowerCase()
            if (listingType)     where.listingType     = listingType.toLowerCase()
            if (furnishingStatus) where.furnishingStatus = furnishingStatus.toLowerCase()

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
    // ── KNN: SIMILAR PROPERTIES ───────────────────────────────────────────────
    //
    //  College-level K-Nearest Neighbors using Euclidean distance.
    //
    //  Feature vector per property:
    //    [0] price          (numeric, normalised)
    //    [1] areaSize       (numeric, normalised)
    //    [2] bedrooms       (numeric, normalised)
    //    [3] bathrooms      (numeric, normalised)
    //    [4] propertyType   (categorical → 0 if same, 1 if different)
    //    [5] listingType    (categorical → 0 if same, 1 if different)
    //    [6] city           (categorical → 0 if same, 1 if different)
    //
    getSimilarProperties = async (propertyId, k = 4) => {
        try {
            // 1. Fetch the target property
            const target = await prisma.property.findUnique({
                where:   { id: propertyId },
                include: DEFAULT_INCLUDE,
            })
            if (!target) throw { status: 404, message: 'Property not found' }

            // 2. Fetch all other active properties (exclude the current one)
            const candidates = await prisma.property.findMany({
                where: {
                    id:     { not: propertyId },
                    status: { in: ['active', 'sold', 'rented'] },
                },
                include: {
                    location: true,
                    images:   { where: { isPrimary: true }, take: 1 },
                    features: true,
                    agent:    { select: { id: true, firstName: true, lastName: true } },
                },
            })

            if (candidates.length === 0) return []

            // 3. Collect all properties (target + candidates) to compute global min/max
            const all = [target, ...candidates]

            const getNum = (p, key) => parseFloat(p[key]) || 0

            const prices    = all.map(p => getNum(p, 'price'))
            const areas     = all.map(p => getNum(p, 'areaSize'))
            const bedrooms  = all.map(p => getNum(p, 'bedrooms'))
            const bathrooms = all.map(p => getNum(p, 'bathrooms'))

            // Min-max normalisation helper: returns 0 if range is 0
            const normalise = (value, min, max) =>
                max === min ? 0 : (value - min) / (max - min)

            const minMax = (arr) => ({ min: Math.min(...arr), max: Math.max(...arr) })

            const priceRange    = minMax(prices)
            const areaRange     = minMax(areas)
            const bedroomRange  = minMax(bedrooms)
            const bathroomRange = minMax(bathrooms)

            // 4. Build feature vector for the target property
            const targetVec = [
                normalise(getNum(target, 'price'),     priceRange.min,    priceRange.max),
                normalise(getNum(target, 'areaSize'),  areaRange.min,     areaRange.max),
                normalise(getNum(target, 'bedrooms'),  bedroomRange.min,  bedroomRange.max),
                normalise(getNum(target, 'bathrooms'), bathroomRange.min, bathroomRange.max),
                0, // categorical: distance from itself is always 0
                0,
                0,
            ]

            // 5. Compute Euclidean distance for each candidate
            const withDistance = candidates.map(candidate => {
                const vec = [
                    normalise(getNum(candidate, 'price'),     priceRange.min,    priceRange.max),
                    normalise(getNum(candidate, 'areaSize'),  areaRange.min,     areaRange.max),
                    normalise(getNum(candidate, 'bedrooms'),  bedroomRange.min,  bedroomRange.max),
                    normalise(getNum(candidate, 'bathrooms'), bathroomRange.min, bathroomRange.max),
                    candidate.propertyType === target.propertyType ? 0 : 1,
                    candidate.listingType  === target.listingType  ? 0 : 1,
                    candidate.location?.city?.toLowerCase() === target.location?.city?.toLowerCase() ? 0 : 1,
                ]

                // Euclidean distance = sqrt(sum of squared differences)
                const distance = Math.sqrt(
                    vec.reduce((sum, val, i) => sum + Math.pow(val - targetVec[i], 2), 0)
                )

                return { candidate, distance }
            })

            // 6. Sort by ascending distance (nearest first) and take top K
            withDistance.sort((a, b) => a.distance - b.distance)
            const topK = withDistance.slice(0, k).map(item => item.candidate)

            return topK.map(serialize)
        } catch (exception) {
            throw exception
        }
    }
}



module.exports = new PropertyService()