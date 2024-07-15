const express = require ("express")
const router = express.Router()
const auth =require("../Middleware/auth");

const userController = require("../controllers/userControllers")
router.post("/signup",userController.signup)
router.post("/login",userController.login)
router.post("/addAdmin",auth.loggedMiddleware, auth.isAdmin,userController.AddAdmin)
router.patch('/setStatus/:id',auth.loggedMiddleware, auth.isAdmin,userController.statut)
router.get('/user/:id',auth.loggedMiddleware, auth.isAdmin,userController.getuser)

//router.post("/login",userController.login)
module.exports = router
