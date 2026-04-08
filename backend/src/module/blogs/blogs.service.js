const prisma = require('../../config/db.config')

// Convert a Prisma Bytes buffer to a base64 data-URI (returns null if falsy)
const toBase64 = (buf, mime = 'image/jpeg') =>
    buf ? `data:${mime};base64,${Buffer.from(buf).toString('base64')}` : null

const serialize = (record) => {
    if (!record) return null
    return {
        ...record,
        thumbnail:    toBase64(record.thumbnail),
        heroImage:    toBase64(record.heroImage),
        authorAvatar: toBase64(record.authorAvatar),
    }
}

class BlogsService {
    createBlogs = async (data) => {
        try {
            const blog = await prisma.blog.create({ data })
            return serialize(blog)
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    index = async ({ filter = {}, limit = 10, skip = 0 }) => {
        try {
            const [count, rows] = await Promise.all([
                prisma.blog.count({ where: filter }),
                prisma.blog.findMany({
                    where: filter,
                    take: limit,
                    skip: skip,
                    orderBy: { createdAt: 'desc' },
                }),
            ])
            return { count, blogs: rows.map(serialize) }
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    getIdByFilter = async (filter) => {
        try {
            return serialize(await prisma.blog.findUnique({ where: filter }))
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    updateBlogs = async (id, data) => {
        try {
            return serialize(await prisma.blog.update({ where: { id }, data }))
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    deleteBlogs = async (id) => {
        try {
            return serialize(await prisma.blog.delete({ where: { id } }))
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    likeBlogs = async (id) => {
        try {
            return serialize(await prisma.blog.update({ where: { id }, data: { likes: { increment: 1 } } }))
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }

    viewBlogs = async (id) => {
        try {
            return serialize(await prisma.blog.update({ where: { id }, data: { views: { increment: 1 } } }))
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }
}
module.exports = new BlogsService()