const prisma = require("../../config/db.config");

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
        avatarUrl: bufferToBase64(record.avatarUrl),
    }
}

class AgentsService {
    create = async(data)=>{
        try{
            const response = await prisma.agent.create({
                data:data
            })
            return serialize(response)
        }catch(exception){
            console.log(exception);
            throw exception
        }
    }
    index = async(filter = {}, skip = 0, limit = 10)=>{
        try{
            const where = {}
            if(filter.search){
                where.OR = [
                    {firstName: {contains: filter.search, mode: "insensitive"}},
                    {lastName: {contains: filter.search, mode: "insensitive"}},
                    {email: {contains: filter.search, mode: "insensitive"}},
                    {phone: {contains: filter.search, mode: "insensitive"}}
                ]
            }
            const [data, count] = await Promise.all([
                prisma.agent.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: {createdAt: "desc"}
                }),
                prisma.agent.count({where})
            ])
            return {data: data.map(serialize), count}
        }catch(exception){
            throw(exception)
        }

    }
    getAgentById = async(id)=>{
        try{
            const agent = await prisma.agent.findUnique({
                where: {id}
            })
            return serialize(agent)
        }catch(exception){
            throw(exception)
        }
    }
    update = async(id, data)=>{
        try{
            const response = await prisma.agent.update({
                where: {id},
                data:data
            })
            return serialize(response)
        }catch(exception){
            throw(exception)
        }
    }
    delete = async(id)=>{
        try{
            const response = await prisma.agent.delete({
                where: {id}
            })
            return serialize(response)
        }catch(exception){
            throw(exception)
        }
    }
}

module.exports = new AgentsService()