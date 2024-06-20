const express = require('express')
const router = express.Router()
const employeePointsController = require('../controllers/employeePointsController')

router.get(
  '/:matricule',
  employeePointsController.getEmployeePointsByMatricule,
)
router.get(
  '/getEmployeePointsDetails/:matricule',
  employeePointsController.getEmployeePointsDetails,
)

module.exports = router
