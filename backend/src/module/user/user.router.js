const express = require("express");
const router  = express.Router();


const loginCheck    = require("../../middleware/auth.middlewares");
const hasPermission = require("../../middleware/rbac.middlewares");
const { bodyValidator }    = require("../../middleware/validator.middlewares");

const userController = require("./user.controller");
const {
    userCreateDTO,
    userUpdateDTO,
} = require("./user.request");
const { Role } = require("../../config/constant.config");
 
router.route('/')
    .post(
        loginCheck,
        bodyValidator(userCreateDTO),
        userController.createAdminStaff
    )
    .get(
        loginCheck,
        hasPermission([Role.ADMIN]),
        userController.listUsers
    );
  
router.route("/:id")
    .get(
        loginCheck,
        userController.getUserById
    )
    .put(
        loginCheck,
        bodyValidator(userUpdateDTO),
        userController.updateUser
    )
    .delete(
        "/:id",
        loginCheck,
        userController.deleteUser
    );
module.exports = router;
