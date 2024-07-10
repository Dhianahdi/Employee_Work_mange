const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeePointsSchema = new Schema({
  matricule: { type: String, required: true, unique: true },
  details: {
    type: Map,
    of: {
      points: [String],
      jour: String,
      erreur: String,
      heuresTravail: String,
      heuresNormales: String,
      heuresSupplementaires: String,

    },
  },
  totalHeuresNormales: String,
  totalHeuresSupplementaires: String,
  totalHeuresSamedi: String,
  totalHeuresDimanche: String,
  absences: [String],
     nbrAbsentParMois: { 
    type: Map, 
    of: Number, 
    default: {}
  },
  ponctualiteParMois: { 
    type: Map, 
    of: Number, 
    default: {}
  },
  retardParMois: { 
    type: Map, 
    of: Number, 
    default: {}
  }

});

const EmployeePoints = mongoose.model('EmployeePoints', employeePointsSchema);

module.exports = EmployeePoints;