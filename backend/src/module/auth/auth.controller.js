const bcrypt = require("bcryptjs");
const userService = require("../user/user.service");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthController {
    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await userService.getSingleUserByFilter({
                email: email
            })

            if (!user) {
                throw { status: 401, message: "User not found" }
            }

            if (bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign({
                    sub: user.id,
                }, process.env.JWT_SECRET, {
                    expiresIn: "1d"
                })
                const refreshToken = jwt.sign({
                    sub: user.id,
                    type: "refresh"
                }, process.env.JWT_SECRET, {
                    expiresIn: "7d"
                })

                res.json({
                    result: {
                        userDetails: {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            role: user.role,
                        },
                        token: { token, refreshToken }

                    },
                    message: "User logged in successfully",
                    meta: null
                })
            } else {
                throw { status: 401, message: "Invalid Credentials" }
            }
        } catch (error) {
            console.log("login error", error)
            next(error)
        }
    }
    getLoggedInUser = async (req, res, next) => {
        try {
            res.json({
                result: req.authUser,
                message: "User Profile",
                meta: null
            })
        } catch (error) {
            console.log("getLoggedInUser error", error)
            next(error)
        }
    }
    logout = async (req, res, next) => {
        try {
            // Logout logic depends on how tokens are managed. 
            // If stateless, just return success. If stored in DB, clear them.
            res.json({
                result: null,
                message: "User logged out successfully",
                meta: null
            })

        } catch (error) {
            console.log("logout error", error)
            next(error)
        }
    }
    changePassword = async (req, res, next) => {
        try {

        } catch (error) {

        }
    }


}
module.exports = new AuthController();