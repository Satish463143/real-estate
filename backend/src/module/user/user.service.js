const prisma = require("../../config/db.config");


class UserService {
    create = async(data)=>{
        try{
            const response = await prisma.user.create({
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
                prisma.user.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: {createdAt: "desc"}
                }),
                prisma.user.count({where})
            ])
            return {data, count}
        }catch(exception){
            throw(exception)
        }

    }
    getUserById = async(id)=>{
        try{
            const user = await prisma.user.findUnique({
                where: {id}
            })
            return user
        }catch(exception){
            throw(exception)
        }
    }
    update = async(id, data)=>{
        try{
            const response = await prisma.user.update({
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
            const response = await prisma.user.delete({
                where: {id}
            })
            return response
        }catch(exception){
            throw(exception)
        }
    }
}

module.exports = new UserService();