const Authorization = require('../models/authorization');

// Créer une autorisation
exports.createAuthorization = async (req, res) => {
  try {
    const newAuthorization = new Authorization(req.body);
    const savedAuthorization = await newAuthorization.save();
    res.status(201).json(savedAuthorization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir toutes les autorisations
exports.getAuthorizations = async (req, res) => {
  try {
    const authorizations = await Authorization.find().populate('idEmployee');
    res.status(200).json(authorizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir une autorisation par ID
exports.getAuthorizationById = async (req, res) => {
  try {
    const authorization = await Authorization.findById(req.params.id).populate('idEmployee');
    if (!authorization) {
      return res.status(404).json({ message: 'Autorisation non trouvée' });
    }
    res.status(200).json(authorization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une autorisation par ID
exports.updateAuthorization = async (req, res) => {
  try {
    const updatedAuthorization = await Authorization.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedAuthorization) {
      return res.status(404).json({ message: 'Autorisation non trouvée' });
    }
    res.status(200).json(updatedAuthorization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une autorisation par ID
exports.deleteAuthorization = async (req, res) => {
  try {
    const deletedAuthorization = await Authorization.findByIdAndDelete(req.params.id);
    if (!deletedAuthorization) {
      return res.status(404).json({ message: 'Autorisation non trouvée' });
    }
    res.status(200).json({ message: 'Autorisation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
