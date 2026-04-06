const prisma = require("../../config/db.config")

class PropertyService{
    create = async(data)=>{
        try{
            const property = await prisma.property.create({
                data:data
            })
            return property
        }catch(exception){
            throw exception
        }
    }
    index = async(limit,skip,filter)=>{
        try{
             const [data, count] = await Promise.all([
                prisma.property.findMany({
                    where:filter,
                    skip,
                    take: limit,
                    orderBy: {createdAt: "desc"}
                }),
                prisma.property.count({where:filter})
            ])
            return {data, count}
        }catch(exception){
            throw exception
        }
    }
    getPropertyById = async(id)=>{
        try{
            const property = await prisma.property.findUnique({
                where:{id:id}
            })
            return property
        }catch(exception){  
            throw exception
        }
    }
    update = async(id,data)=>{
        try{
            const property = await prisma.property.update({
                where:{id:id},
                data:data
            })
            return property
        }catch(exception){
            throw exception
        }
    }
    delete = async(id)=>{
        try{
            const property = await prisma.property.delete({
                where:{id:id}
            })
            return property
        }catch(exception){
            throw exception
        }
    }
    listForHome = async(filters = {}, limit = 10, skip = 0)=>{
        try{
            const {
                search,
                propertyType,
                listingType,
                status,           // further narrowed below
                minPrice,
                maxPrice,
                bedrooms,
                bathrooms,
                minArea,
                maxArea,
                yearBuilt,
                isFeatured,
                furnishingStatus,
                sortBy = "createdAt",
                sortOrder = "desc",
            } = filters

            // ── Allowed statuses for public home listing ──────────────
            const ALLOWED_STATUSES = ["ACTIVE", "SOLD", "RENTED"]
            const statusFilter = status && ALLOWED_STATUSES.includes(status.toUpperCase())
                ? status.toUpperCase()
                : { in: ALLOWED_STATUSES }

            const where = {
                status: statusFilter,
            }

            // ── Full-text search on indexed fields ────────────────────
            if (search) {
                where.OR = [
                    { title:       { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                    { location: { city:    { contains: search, mode: "insensitive" } } },
                    { location: { country: { contains: search, mode: "insensitive" } } },
                ]
            }

            // ── Enum filters (indexed) ────────────────────────────────
            if (propertyType)    where.propertyType    = propertyType.toUpperCase()
            if (listingType)     where.listingType     = listingType.toUpperCase()
            if (furnishingStatus) where.furnishingStatus = furnishingStatus.toUpperCase()

            // ── Boolean flag ──────────────────────────────────────────
            if (isFeatured !== undefined) where.isFeatured = isFeatured === "true" || isFeatured === true

            // ── Price range (indexed on price) ────────────────────────
            if (minPrice || maxPrice) {
                where.price = {}
                if (minPrice) where.price.gte = parseFloat(minPrice)
                if (maxPrice) where.price.lte = parseFloat(maxPrice)
            }

            // ── Bedroom / bathroom (exact or min) ────────────────────
            if (bedrooms)  where.bedrooms  = { gte: parseInt(bedrooms, 10) }
            if (bathrooms) where.bathrooms = { gte: parseInt(bathrooms, 10) }

            // ── Area size range (indexed on areaSize) ─────────────────
            if (minArea || maxArea) {
                where.areaSize = {}
                if (minArea) where.areaSize.gte = parseFloat(minArea)
                if (maxArea) where.areaSize.lte = parseFloat(maxArea)
            }

            // ── Year built (indexed on yearBuilt) ─────────────────────
            if (yearBuilt) where.yearBuilt = parseInt(yearBuilt, 10)

            // ── Allowed sort fields (all indexed) ─────────────────────
            const SORTABLE = ["createdAt","price","bedrooms","bathrooms","areaSize","yearBuilt","isFeatured"]
            const orderBy = { [SORTABLE.includes(sortBy) ? sortBy : "createdAt"]: sortOrder === "asc" ? "asc" : "desc" }

            const [data, count] = await Promise.all([
                prisma.property.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy,
                    include: {
                        location: true,
                        images:   { where: { isPrimary: true }, take: 1 },
                        features: true,
                        agent:    { select: { id: true, userId: true } },
                    },
                }),
                prisma.property.count({ where }),
            ])

            return { data, count }
        }catch(exception){
            throw exception
        }
    }

}
module.exports = new PropertyService()