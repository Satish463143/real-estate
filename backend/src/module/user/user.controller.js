const userService = require("./user.service");
const bcrypt = require("bcryptjs");

class UserController {
   create = async(req,res,next)=>{
           try{
               const data = req.body
               // hash password before saving to database
               data.password = await bcrypt.hash(data.password, 10)
   
               const response = await userService.create(data)
   
               res.json({
                   result:response,
                   message: "User created successfully",
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
               const {data, count} = await userService.index(limit,skip,filter)
   
               res.json({
                   result:data,
                   message: "Users fetched successfully",
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
           if (!id) throw { status: 400, message: "User id is required" }
           const user = await userService.getUserById(id)
           if (!user) throw { status: 404, message: "User not found" }
           return user
       }
       showById = async(req,res,next)=>{
           try{
               const user = await this.#validate(req.params.id)
               res.json({
                   result:user,
                   message: "User fetched successfully",
                   meta : null
               })
           }catch(exception){
               console.log(exception);
               next(exception)
           }
       }
       update = async(req,res,next)=>{
           try{
               const user = await this.#validate(req.params.id)
               const data = req.body
               const response = await userService.update(user.id, data)
               res.json({
                   result:response,
                   message: "User updated successfully",
                   meta : null
               })
           }catch(exception){
               console.log(exception);
               next(exception)
           }
       }
       delete = async(req,res,next)=>{
           try{
               const user = await this.#validate(req.params.id)
               const response = await userService.delete(user.id)
               res.json({
                   result:response,
                   message: "User deleted successfully",
                   meta : null
               })
   
           }catch(exception){
               console.log(exception);
               next(exception)
           }
       }
}

module.exports = new UserController();