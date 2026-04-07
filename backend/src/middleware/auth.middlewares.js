
require("dotenv").config();
const jwt = require("jsonwebtoken");
const userService = require("../module/user/user.service");

const loginCheck = async (req, res, next) => {
    try {
        let token = req.headers['authorization'] || null;
        if (!token) {
            throw { status: 401, message: "Unauthorized access: Token not provided" };
        }

        token = token.split(" ").pop();

        const data = jwt.verify(token, process.env.JWT_SECRET);
        if(data.hasOwnProperty('type')){
            throw{status:403, message: "Main Token is required"}
        }

        const user = await userService.getUserById({
            id: data.sub
        });

        if (!user) {
            throw { status: 404, message: "User does not exist" };
        }

        req.authUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email:user.email,
        };
        next();
    } catch (exception) {
        next({ status: exception.status || 401, message: exception.message || "Unauthorized" });
    }
};

module.exports = loginCheck;
