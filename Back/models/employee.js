const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  nom: { type: String },
  matricule: { type: String },
  hiredate: { type: String },
  status: { type: String },
  department: { type: String },
  tel: { type: String, default: '00000000' },
  image: { type: String, default: 'user.png' },
  DP: { type: Boolean, default: false },
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

module.exports = mongoose.model('Employee', employeeSchema);
