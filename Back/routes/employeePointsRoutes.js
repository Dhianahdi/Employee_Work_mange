const express = require('express')
const router = express.Router()
const employeePointsController = require('../controllers/employeePointsController')

router.get(
  '/:matricule',
  employeePointsController.getEmployeePointsByMatricule,
)

module.exports = router
