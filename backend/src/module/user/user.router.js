const express = require("express");
const router  = express.Router();
const loginCheck    = require("../../middleware/auth.middlewares");
const hasPermission = require("../../middleware/rbac.middlewares");
const { bodyValidator }    = require("../../middleware/validator.middlewares");
const userController = require("./user.controller");
const { userCreateDTO, userUpdateDTO } = require("./user.request");
const { Role } = require("../../config/constant.config");
 
router.route('/')
    //anyone can create their profile
    .post(
        bodyValidator(userCreateDTO),
        userController.createAdminStaff
    )
    //list all user only admin can access
    .get(
        loginCheck,
        hasPermission([Role.ADMIN]),
        userController.listUsers
    );
  
router.route("/:id")
    //admin can see user details by id  
    .get(
        loginCheck,
        hasPermission([Role.ADMIN]),
        userController.getUserById
    )
    //only slef user can update their profile
    .put(
        loginCheck,
        bodyValidator(userUpdateDTO),
        userController.updateUser
    )
    //only admin can delete user
    .delete(
        "/:id",
        loginCheck,
        hasPermission([Role.ADMIN]),
        userController.deleteUser
    );
module.exports = router;
