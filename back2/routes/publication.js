const express = require ("express")
const router = express.Router()
const auth =require("../Middleware/auth");

const publocationController = require("../controllers/publocationControllers")
router.post('/addPublication/:authorLogin',publocationController.ajouterPublication)
router.get('/Publication/:id',publocationController.getPublication)

module.exports = router