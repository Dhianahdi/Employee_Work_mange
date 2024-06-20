const express = require('express');
const router = express.Router();
const authorizationController = require('../controllers/authorizationController');

// Route pour créer une nouvelle autorisation
router.post('/', authorizationController.createAuthorization);

// Route pour obtenir toutes les autorisations
router.get('/', authorizationController.getAuthorizations);

// Route pour obtenir une autorisation par ID
router.get('/:matricule', authorizationController.getAuthorizationsByMatricule);

// Route pour mettre à jour une autorisation par ID
router.put('/:id', authorizationController.updateAuthorization);

// Route pour supprimer une autorisation par ID
router.delete('/:id', authorizationController.deleteAuthorization);

module.exports = router;
