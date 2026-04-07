const agentsService = require("./agents.service");

class AgentsController {
    create = async(req,res,next)=>{
        try{
            const data = req.body

            const response = await agentsService.create(data)

            res.json({
                result:response,
                message: "Agent created successfully",
                meta : null
            })

        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }
    index = async(req,res,next)=>{
        try{
            const limit = req.query.limit || 10
            const page = req.query.page || 0
            const skip = (page - 1) * limit 

            let filter = {}
            if (req.query.search){
                filter.OR = [
                    {firstName: {contains: req.query.search}},
                    {lastName: {contains: req.query.search}},
                    {email: {contains: req.query.search}},
                    {phone: {contains: req.query.search}}
                ]
            }
            const {data, count} = await agentsService.index(limit,skip,filter)

            res.json({
                result:data,
                message: "Agents fetched successfully",
                meta : {
                    currentPage:page,
                    total:count,
                    limit:limit
                }
            })

        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }
    #validate = async (id) => {
        if (!id) throw { status: 400, message: "Agent id is required" }
        const agent = await agentsService.getAgentById(id)
        if (!agent) throw { status: 404, message: "Agent not found" }
        return agent
    }
    showById = async(req,res,next)=>{
        try{
            const agent = await this.#validate(req.params.id)
            res.json({
                result:agent,
                message: "Agent fetched successfully",
                meta : null
            })
        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }
    update = async(req,res,next)=>{
        try{
            const agent = await this.#validate(req.params.id)
            const response = await agentsService.update(agent.id, req.body)
            res.json({
                result:response,
                message: "Agent updated successfully",
                meta : null
            })
        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }
    delete = async(req,res,next)=>{
        try{
            const agent = await this.#validate(req.params.id)
            const response = await agentsService.delete(agent.id)
            res.json({
                result:response,
                message: "Agent deleted successfully",
                meta : null
            })

        }catch(exception){
            console.log(exception);
            next(exception)
        }
    }

}
module.exports = new AgentsController()