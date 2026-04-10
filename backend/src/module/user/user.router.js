const router = require("express").Router();
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
        userController.create
    )
    //list all user only admin can access
    .get(
        loginCheck,
        hasPermission([Role.ADMIN]),
        userController.index
    );
  
router.route("/:id")
    //admin can see user details by id  
    .get(
        loginCheck,
        hasPermission([Role.ADMIN]),
        userController.showById
    )
    //only slef user can update their profile
    .put(
        loginCheck,
        bodyValidator(userUpdateDTO),
        userController.update
    )
    //only admin can delete user
    .delete(
        loginCheck,
        hasPermission([Role.ADMIN]),
        userController.delete
    );

module.exports = router;
