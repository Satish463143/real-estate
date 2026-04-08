const prisma = require('../../config/db.config')

/**
 * Converts a Prisma Bytes (Buffer) field to a base64 data-URI string
 * so it can be sent over JSON to the frontend.
 * Returns null if the buffer is empty/null.
 */
const bufferToBase64 = (buffer, mimeType = 'image/jpeg') => {
    if (!buffer) return null
    return `data:${mimeType};base64,${Buffer.from(buffer).toString('base64')}`
}

/**
 * Serialize a testimonial record: convert the image Buffer → base64 string
 * before sending it as JSON.
 */
const serialize = (record) => {
    if (!record) return null
    return {
        ...record,
        image: bufferToBase64(record.image),
    }
}

class TestimonialService {

    createTestimonial = async (data) => {
        try {
            const testimonial = await prisma.testimonial.create({ data })
            return serialize(testimonial)
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }

    listAll = async ({ filter = {}, limit = 10, skip = 0 }) => {
        try {
            const [count, testimonials] = await Promise.all([
                prisma.testimonial.count({ where: filter }),
                prisma.testimonial.findMany({
                    where: filter,
                    take: limit,
                    skip: skip,
                    orderBy: { createdAt: 'desc' },
                }),
            ])
            return { count, testimonials: testimonials.map(serialize) }
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }

    getByFilter = async (filter) => {
        try {
            return serialize(await prisma.testimonial.findUnique({ where: filter }))
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }

    updateTestimonial = async (id, data) => {
        try {
            return serialize(
                await prisma.testimonial.update({ where: { id }, data })
            )
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }

    deleteTestimonial = async (id) => {
        try {
            return serialize(await prisma.testimonial.delete({ where: { id } }))
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }
}

module.exports = new TestimonialService()