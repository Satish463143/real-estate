const prisma = require("../../config/db.config");

class AgentsService {
    create = async(data)=>{
        try{
            const response = await prisma.agent.create({
                data:data
            })
            return response
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
            return {data, count}
        }catch(exception){
            throw(exception)
        }

    }
    getAgentById = async(id)=>{
        try{
            const agent = await prisma.agent.findUnique({
                where: {id}
            })
            return agent
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
            return response
        }catch(exception){
            throw(exception)
        }
    }
    delete = async(id)=>{
        try{
            const response = await prisma.agent.delete({
                where: {id}
            })
            return response
        }catch(exception){
            throw(exception)
        }
    }
}

module.exports = new AgentsService()