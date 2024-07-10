const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const congeSchema = new Schema({
  matricule: { type: String, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  raison: { type: String, required: true },
});

module.exports = mongoose.model('Conge', congeSchema);
