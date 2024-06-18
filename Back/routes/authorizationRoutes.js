const express = require('express');
const router = express.Router();
const authorizationController = require('../controllers/authorizationController');

// Route pour créer une nouvelle autorisation
router.post('/authorizations', authorizationController.createAuthorization);

// Route pour obtenir toutes les autorisations
router.get('/authorizations', authorizationController.getAuthorizations);

// Route pour obtenir une autorisation par ID
router.get('/authorizations/:id', authorizationController.getAuthorizationById);

// Route pour mettre à jour une autorisation par ID
router.put('/authorizations/:id', authorizationController.updateAuthorization);

// Route pour supprimer une autorisation par ID
router.delete('/authorizations/:id', authorizationController.deleteAuthorization);

module.exports = router;
