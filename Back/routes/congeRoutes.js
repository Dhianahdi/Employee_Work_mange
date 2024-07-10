const express = require('express');
const router = express.Router();
const congeController = require('../controllers/congeController');

router.post('/', congeController.createConge);
router.get('/', congeController.getAllConges);
router.get('/:id', congeController.getCongeById);
router.put('/:id', congeController.updateConge);
router.delete('/:id', congeController.deleteConge);
router.get('/search/:matricule/:date', congeController.getCongesByMatriculeAndDate);

module.exports = router;
