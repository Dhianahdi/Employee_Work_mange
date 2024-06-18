const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employeeController')

// Route pour créer un nouvel employé
router.post('/employees', employeeController.createEmployee)

// Route pour obtenir tous les employés
router.get('/employees', employeeController.getEmployees)

// Route pour obtenir un employé par ID
router.get('/employees/:id', employeeController.getEmployeeById)
router.get('/getEmployeeByMatricule/:matricule', employeeController.getEmployeeByMatricule)

// Route pour mettre à jour un employé par ID
router.put('/employees/:id', employeeController.updateEmployee)

// Route pour supprimer un employé par ID
router.delete('/employees/:id', employeeController.deleteEmployee)
router.get('/group-points-by-employee', employeeController.groupPointsByEmployee)
router.get('/createEmployeesFromList', employeeController.createEmployeesFromList)

module.exports = router
