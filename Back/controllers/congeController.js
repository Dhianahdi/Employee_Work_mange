const Conge = require('../models/conge');

// Créer un nouveau congé
exports.createConge = async (req, res) => {
  try {
    const conge = new Conge(req.body);
    await conge.save();
    res.status(201).json(conge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir tous les congés
exports.getAllConges = async (req, res) => {
  try {
    const conges = await Conge.find();
    res.status(200).json(conges);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir un congé par ID
exports.getCongeById = async (req, res) => {
  try {
    const conge = await Conge.findById(req.params.id);
    if (!conge) return res.status(404).json({ message: 'Conge non trouvé' });
    res.status(200).json(conge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un congé
exports.updateConge = async (req, res) => {
  try {
    const conge = await Conge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!conge) return res.status(404).json({ message: 'Conge non trouvé' });
    res.status(200).json(conge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un congé
exports.deleteConge = async (req, res) => {
  try {
    const conge = await Conge.findByIdAndDelete(req.params.id);
    if (!conge) return res.status(404).json({ message: 'Conge non trouvé' });
    res.status(200).json({ message: 'Conge supprimé' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir les congés par matricule et date
exports.getCongesByMatriculeAndDate = async (req, res) => {
  try {
    const { matricule, date } = req.params;
    console.log( {matricule, date });
    const formattedDate = new Date(date);

    const conges = await Conge.find({
      matricule: matricule,
      dateDebut: { $lte: formattedDate },
      dateFin: { $gte: formattedDate }
    });

    if (conges.length > 0) {
      res.status(200).json({ enConge: true, conges });
    } else {
      res.status(200).json({ enConge: false });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

